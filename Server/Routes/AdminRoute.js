import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const tokens = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie("token", tokens);
      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }
  });
});

router.get("/category", (req, res) => {
  const sql = "SELECT * FROM categories";
  con.query(sql, (err, result) => {
    if (err) {
      return res.json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Data: result });
  });
});

router.post("/add_category", (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ Status: false, Error: "Category name is required" });
  }

  const sql = "INSERT INTO categories (`name`) VALUES (?)";
  con.query(sql, [category], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ Status: false, Error: "Database query error" });
    }
    return res.status(200).json({ Status: true });
  });
});

router.post("/add_employee", (req, res) => {
  const sql = "INSERT INTO employee (name, email, password, adress, salary, category_id) VALUES (?)";
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ Status: false, Error: "Error hashing password" });
    }
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.adress,
      req.body.salary,
      req.body.category_id,
    ];
    con.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ Status: false, Error: err.message });
      }
      return res.status(200).json({ Status: true });
    });
  });
});

router.get("/employee", (req, res) => {
  const sql = "SELECT * FROM employee";
  con.query(sql, (err, result) => {
    if (err) {
      return res.json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Data: result });
  });
});

router.get('/employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?";
  con.query(sql,[id], (err, result) => {
    if (err) {
      return res.json({ Status: false, Error: "Query Error" })
    }
    return res.json({ Status: true, Data: result })
  });
})

router.put('/edit_employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE employee
               SET name = ?, email = ?, salary = ?, adress = ?, category_id = ?
               WHERE id = ?`;
  const values = [
    req.body.name,
    req.body.email,
    req.body.salary,
    req.body.adress,
    req.body.category_id,
  ];

  console.log(`Updating employee with id: ${id}`);  // Logging for debugging
  con.query(sql, [...values, id], (err, result) => {
    if (err) {
      console.error("Query Error:", err);  // Logging for debugging
      return res.json({ status: false, error: 'Query Error' });
    }
    console.log("Update Result:", result);  // Logging for debugging
    return res.json({ status: true, data: result });
  });
});

router.delete('/delete_employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = "delete from employee where id = ?"
  con.query(sql,[id], (err, result) => {
    if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/admin_count', (req, res) => {
  const sql= "select count(id) AS admin from admin";
  con.query(sql, (err, result) => {
    if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/employee_count', (req, res) => {
  const sql= "select count(id) AS employee from employee";
  con.query(sql, (err, result) => {
    if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/salary_count', (req, res) => {
  const sql= "select sum(salary) AS salary from employee";
  con.query(sql, (err, result) => {
    if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/admin_records', (req, res) => {
  const sql= "select * from admin"
  con.query(sql, (err, result) => {
    if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({Status:true})
})

export { router as adminRouter };
