
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "backend/.env" });

const app = express();

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

        // Get and lock the selected product
        const [rows] = await db.execute(
            "SELECT id, quantity FROM products WHERE id = ? FOR UPDATE",
            [product_id]
        );

        if (rows.length === 0) {
            await db.rollback();
            transactionStarted = false;

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const previousQuantity = Number(rows[0].quantity);

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
