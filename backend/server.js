
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "backend/.env" });

const app = express();
const WAREHOUSE_CAPACITY = 5000;

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

app.use(express.json());

// Connect to MySQL
const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

console.log("Connected to StockTrace MySQL database");

// Test API
app.get("/", (req, res) => {
    res.json({
        message: "StockTrace API is running"
    });
});

// Login API
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check empty credentials
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Compare credentials with MySQL login table
       const [rows] = await db.execute(
    "SELECT * FROM login WHERE email = ? AND password = ?",
    [email.trim(), password]
);

if (rows.length > 0) {
    return res.json({
        success: true,
        message: "Login successful"
    });
}

return res.status(401).json({
    success: false,
    message: "Wrong email or password"
});

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});



// Get products from MySQL for the dashboard
app.get("/products", async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT id, product_name, sku, category,
                    quantity, price, minimum_stock
             FROM products
             ORDER BY id DESC`
        );

        res.json({
            success: true,
            products: rows
        });

    } catch (error) {
        console.error("Products error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch products"
        });
    }
});



// Add new product to MySQL
app.post("/products", async (req, res) => {
    try {
        const {
            product_name,
            sku,
            category,
            price,
            quantity,
            minimum_stock,
            location,
            description
        } = req.body;

        if (
            !product_name ||
            !sku ||
            !category ||
            price === "" ||
            quantity === "" ||
            minimum_stock === "" ||
            price == null ||
            quantity == null ||
            minimum_stock == null
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields"
            });
        }

        await db.execute(
            `INSERT INTO products
            (product_name, sku, category, price, quantity,
             minimum_stock, location, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                product_name.trim(),
                sku.trim(),
                category,
                Number(price),
                Number(quantity),
                Number(minimum_stock),
                location || null,
                description || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Product added successfully"
        });

    } catch (error) {
        console.error("Add product error:", error.message);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "This SKU already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Unable to save product. Check your database columns."
        });
    }
});

// Update an existing product
app.put("/products/:id", async (req, res) => {
    const productId = Number(req.params.id);
    const {
        product_name,
        sku,
        category,
        price,
        quantity,
        minimum_stock
    } = req.body;

    const productPrice = Number(price);
    const productQuantity = Number(quantity);
    const minimumStock = Number(minimum_stock);

    if (
        !Number.isSafeInteger(productId) ||
        productId <= 0 ||
        typeof product_name !== "string" ||
        !product_name.trim() ||
        typeof sku !== "string" ||
        !sku.trim() ||
        typeof category !== "string" ||
        !category.trim() ||
        price == null ||
        price === "" ||
        !Number.isFinite(productPrice) ||
        productPrice < 0 ||
        quantity == null ||
        quantity === "" ||
        !Number.isSafeInteger(productQuantity) ||
        productQuantity < 0 ||
        minimum_stock == null ||
        minimum_stock === "" ||
        !Number.isSafeInteger(minimumStock) ||
        minimumStock < 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide valid product details"
        });
    }

    try {
        const [result] = await db.execute(
            `UPDATE products
             SET product_name = ?, sku = ?, category = ?,
                 price = ?, quantity = ?, minimum_stock = ?
             WHERE id = ?`,
            [
                product_name.trim(),
                sku.trim(),
                category.trim(),
                productPrice,
                productQuantity,
                minimumStock,
                productId
            ]
        );

        if (result.affectedRows === 0) {
            const [rows] = await db.execute(
                "SELECT id FROM products WHERE id = ?",
                [productId]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }
        }

        res.json({
            success: true,
            message: "Product updated successfully"
        });
    } catch (error) {
        console.error("Update product error:", error.message);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "This SKU already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Unable to update product"
        });
    }
});

// Delete a product that is not referenced by stock movement history
app.delete("/products/:id", async (req, res) => {
    const productId = Number(req.params.id);

    if (!Number.isSafeInteger(productId) || productId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }

    try {
        const [result] = await db.execute(
            "DELETE FROM products WHERE id = ?",
            [productId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Delete product error:", error.message);

        if (
            error.code === "ER_ROW_IS_REFERENCED" ||
            error.code === "ER_ROW_IS_REFERENCED_2"
        ) {
            return res.status(409).json({
                success: false,
                message: "This product has stock movement history and cannot be deleted."
            });
        }

        res.status(500).json({
            success: false,
            message: "Unable to delete product"
        });
    }
});

// Generate inventory reports from current stock and recorded movements
app.get("/reports", async (req, res) => {
    try {
        const {
            type = "summary",
            fromDate = "",
            toDate = ""
        } = req.query;

        const isValidDate = date => {
            if (!date) return true;
            if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                return false;
            }

            const parsedDate = new Date(`${date}T00:00:00.000Z`);
            return !Number.isNaN(parsedDate.getTime()) &&
                parsedDate.toISOString().slice(0, 10) === date;
        };

        if (
            !["summary", "movement", "lowstock"].includes(type) ||
            !isValidDate(fromDate) ||
            !isValidDate(toDate) ||
            (fromDate && toDate && fromDate > toDate)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid report type or date range"
            });
        }

        const rangeConditions = [];
        const rangeParams = [];

        if (fromDate) {
            rangeConditions.push("sm.created_at >= ?");
            rangeParams.push(fromDate);
        }

        if (toDate) {
            rangeConditions.push("sm.created_at < DATE_ADD(?, INTERVAL 1 DAY)");
            rangeParams.push(toDate);
        }

        const rangeFilter = rangeConditions.length
            ? ` AND ${rangeConditions.join(" AND ")}`
            : "";
        const afterRangeFilter = toDate
            ? "sm.created_at >= DATE_ADD(?, INTERVAL 1 DAY)"
            : "1 = 0";
        const afterRangeParams = toDate ? [toDate] : [];

        const [rows] = await db.execute(
            `SELECT
                p.id,
                p.product_name AS product,
                p.sku,
                p.quantity AS current_quantity,
                p.minimum_stock,
                p.price,
                COALESCE(SUM(
                    CASE WHEN UPPER(sm.movement_type) = 'IN'${rangeFilter}
                    THEN sm.quantity ELSE 0 END
                ), 0) AS stock_in,
                COALESCE(SUM(
                    CASE WHEN UPPER(sm.movement_type) = 'OUT'${rangeFilter}
                    THEN sm.quantity ELSE 0 END
                ), 0) AS stock_out,
                COALESCE(SUM(
                    CASE WHEN ${afterRangeFilter}
                        AND UPPER(sm.movement_type) = 'IN'
                    THEN sm.quantity ELSE 0 END
                ), 0) AS stock_after_in,
                COALESCE(SUM(
                    CASE WHEN ${afterRangeFilter}
                        AND UPPER(sm.movement_type) = 'OUT'
                    THEN sm.quantity ELSE 0 END
                ), 0) AS stock_after_out
            FROM products p
            LEFT JOIN stock_movements sm ON sm.product_id = p.id
            GROUP BY
                p.id, p.product_name, p.sku, p.quantity,
                p.minimum_stock, p.price
            ORDER BY p.product_name`,
            [
                ...rangeParams,
                ...rangeParams,
                ...afterRangeParams,
                ...afterRangeParams
            ]
        );

        const reportRows = rows.map(row => {
            const stockIn = Number(row.stock_in);
            const stockOut = Number(row.stock_out);
            const closingStock =
                Number(row.current_quantity) -
                Number(row.stock_after_in) +
                Number(row.stock_after_out);
            const openingStock = closingStock - stockIn + stockOut;

            return {
                product: row.product,
                sku: row.sku,
                opening_stock: openingStock,
                stock_in: stockIn,
                stock_out: stockOut,
                closing_stock: closingStock,
                value: closingStock * Number(row.price),
                minimum_stock: Number(row.minimum_stock)
            };
        });

        const report = reportRows.filter(row => {
            if (type === "movement") {
                return row.stock_in > 0 || row.stock_out > 0;
            }

            if (type === "lowstock") {
                return row.closing_stock <= row.minimum_stock;
            }

            return true;
        }).map(({ minimum_stock, ...row }) => row);

        res.json({ success: true, report });
    } catch (error) {
        console.error("Report error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to generate report"
        });
    }
});



// Add a stock movement and update product quantity
app.post("/stock-movements", async (req, res) => {
    let transactionStarted = false;

    try {
        const {
            product_id,
            movement_type,
            quantity,
            reason,
            location,
            remarks
        } = req.body;

        const amount = Number(quantity);

        if (
            !product_id ||
            !["in", "out"].includes(movement_type) ||
            !Number.isInteger(amount) ||
            amount <= 0 ||
            !reason ||
            !location
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields"
            });
        }

        await db.beginTransaction();
        transactionStarted = true;

        // Lock inventory rows so concurrent stock-ins cannot exceed capacity.
        const [rows] = await db.execute(
            "SELECT id, quantity FROM products ORDER BY id FOR UPDATE"
        );

        const selectedProduct = rows.find(
            product => String(product.id) === String(product_id)
        );

        if (!selectedProduct) {
            await db.rollback();
            transactionStarted = false;

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const previousQuantity = Number(selectedProduct.quantity);
        const totalWarehouseStock = rows.reduce(
            (total, product) => total + Number(product.quantity),
            0
        );

        if (
            movement_type === "in" &&
            totalWarehouseStock + amount > WAREHOUSE_CAPACITY
        ) {
            await db.rollback();
            transactionStarted = false;

            return res.status(400).json({
                success: false,
                message: `Overflow: warehouse capacity is ${WAREHOUSE_CAPACITY} units, with only ${Math.max(WAREHOUSE_CAPACITY - totalWarehouseStock, 0)} units remaining`
            });
        }

        const newQuantity = movement_type === "in"
            ? previousQuantity + amount
            : previousQuantity - amount;

        if (newQuantity < 0) {
            await db.rollback();
            transactionStarted = false;

            return res.status(400).json({
                success: false,
                message: "Stock Out quantity exceeds available stock"
            });
        }

        // Update product stock
        await db.execute(
            "UPDATE products SET quantity = ? WHERE id = ?",
            [newQuantity, product_id]
        );

        // Save reason, location and remarks in the existing note column
        const note = [
            `Reason: ${reason}`,
            `Location: ${location}`,
            remarks ? `Remarks: ${remarks}` : ""
        ].filter(Boolean).join(" | ");

        // Save transaction history
        await db.execute(
            `INSERT INTO stock_movements
            (product_id, movement_type, quantity,
             previous_quantity, new_quantity, note)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                product_id,
                movement_type,
                amount,
                previousQuantity,
                newQuantity,
                note
            ]
        );

        await db.commit();
        transactionStarted = false;

        res.status(201).json({
            success: true,
            message: "Stock movement saved successfully",
            new_quantity: newQuantity
        });

    } catch (error) {
        if (transactionStarted) {
            await db.rollback();
        }

        console.error("Stock movement error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to save stock movement"
        });
    }
});


// Get recent stock movements
app.get("/stock-movements", async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT
                sm.id,
                sm.product_id,
                p.product_name,
                p.sku,
                sm.movement_type,
                sm.quantity,
                sm.previous_quantity,
                sm.new_quantity,
                sm.note,
                sm.created_at
            FROM stock_movements sm
            LEFT JOIN products p ON p.id = sm.product_id
            ORDER BY sm.created_at DESC, sm.id DESC
            LIMIT 20
        `);

        res.json({
            success: true,
            movements: rows
        });

    } catch (error) {
        console.error("Fetch movements error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch stock movements"
        });
    }
});





// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`StockTrace API running at http://localhost:${PORT}`);
});
