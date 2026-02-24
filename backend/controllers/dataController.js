

// controllers/dataController.js
const sql = require("mssql");
const connection = require("../connection/connection");
const transporter = require("../mailer");
const { generateOTP } = require("../utils");
const dbConfig = require("../config/dbConfig");
const CryptoJS = require('crypto-js');



const otpStorage = {};

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: "pavun.vj@yjktechnologies.com",
    to: email,
    subject: "Login OTP",
    text: `Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Error sending OTP");
  }
};

// Login handler
const login_test = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists in the database
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("Email", sql.NVarChar, email)
      .query("SELECT * FROM yjk_users WHERE Ymail = @Email");

    if (result.recordset.length > 0) {
      // If user exists, generate and send OTP
      const otp = generateOTP();
      await sendOTP(email, otp);

      // Store OTP temporarily for verification
      otpStorage[email] = otp;

      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      res.status(401).json({ message: "Email not found" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Signup handler
const signUp = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Check if the user already exists in the database
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("Email", sql.NVarChar, email)
      .query("SELECT * FROM yjk_users WHERE Ymail = @Email");

    if (result.recordset.length === 0) {
      // If user does not exist, generate and send OTP
      const otp = generateOTP();
      await sendOTP(email, otp);

      // Store OTP temporarily for verification
      otpStorage[email] = otp;

      // Proceed with adding user to the database
      await pool
        .request()
        .input("Name", sql.NVarChar, name)
        .input("Email", sql.NVarChar, email)
        .query("INSERT INTO yjk_users (Name, Ymail) VALUES (@Name, @Email)");

      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      res.status(401).json({ message: "Existing User" });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Verify OTP handler
const verifyOtp = (req, res) => {
  const { email, enteredOtp } = req.body;

  try {
    const storedOtp = otpStorage[email];
    if (storedOtp && storedOtp === enteredOtp) {
      // If OTP is valid, clear the OTP storage
      delete otpStorage[email];
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(401).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getAllData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
     "Exec expenses_det_sp 'S','','',0,'','','','','','',''" 
    /* "exec spexpensetype"*/
    );

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    connection.closeDatabaseConnection();
  }
};

/*
// shows errors from sql (postman checked)
const addData = async (req, res) => {
  const {
    expenses_date,
    expenses_type,
    expenses_amount,
    expenses_spentby,
    remarks,
  } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result  = await pool
      .request()
      .input("expenses_date", sql.DateTime, expenses_date)
      .input("expenses_type", sql.NVarChar, expenses_type)
      .input("expenses_amount", sql.Numeric, expenses_amount)
      .input("expenses_spentby", sql.NVarChar, expenses_spentby)
      .input("remarks", sql.NVarChar, remarks)

      .query(
        "EXEC expenses_det_sp 'I' ,@expenses_date,@expenses_type,@expenses_amount,@expenses_spentby,@remarks,'','','','' "
      );

      // Check if the result contains error messages
    if (result.recordset && result.recordset.length > 0 && result.recordset[0].type === 'Error') {
      const errorDetails = result.recordset[0].details;
      return res.status(400).json({ error: errorDetails });
    }
    res.status(201).send("Data inserted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  } finally {
    connection.closeDatabaseConnection();
  }
};
*/


const addData = async (req, res) => {
  const {
    expenses_date,
    expenses_type,
    expenses_amount,
    expenses_spentby,
    remarks,
  } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode_flag", sql.VarChar, "I")
      .input("expenses_date", sql.DateTime, expenses_date)
      .input("expenses_type", sql.NVarChar, expenses_type)
      .input("expenses_amount", sql.Decimal(28, 3), expenses_amount)
      .input("expenses_spentby", sql.NVarChar, expenses_spentby)
      .input("remarks", sql.NVarChar, remarks)
      .query(
        "EXEC [expenses_det_sp] @mode_flag,@expenses_date,@expenses_type,@expenses_amount,@expenses_spentby,@remarks,'','','','',''"
      );

    // Check if the result contains error messages
    if (result.recordset && result.recordset.length > 0 && result.recordset[0].type === 'Error') {
      const errorDetails = result.recordset.map(error => error.details).join(', ');
      return res.status(400).json({ error: errorDetails }); // Return here
    }

    // If no error messages, send success response
    return res.status(201).send("Data inserted successfully"); // Return here
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error"); // Return here
  } finally {
    connection.closeDatabaseConnection();
  }
};

const UpdExpensesDetails = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).send("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("expenses_date", updatedRow.expenses_date)
        .input("expenses_type", updatedRow.expenses_type)
        .input("expenses_amount", updatedRow.expenses_amount)
        .input("expenses_spentby", updatedRow.expenses_spentby  )
        .input("remarks", updatedRow.remarks)
        .input("keyfield", updatedRow.keyfield)
        .input("modifiedby", updatedRow.modifiedby)
        .query(`EXEC expenses_det_sp @mode,@expenses_date,@expenses_type,@expenses_amount,@expenses_spentby,@remarks,@keyfield,'','',@modifiedby,''`);
    }

    res.status(200).send("Edited data saved successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  } finally {
    connection.closeDatabaseConnection();
  }
};
    

const deleteData = async (req, res) => {
  const empnosToDelete = req.body.empnos;

  if (!empnosToDelete || !empnosToDelete.length) {
    res.status(400).send("Invalid or empty empnos array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    const deleteQuery = `
      DELETE FROM emptab
      WHERE empno IN (${empnosToDelete.join(",")})
    `;

    await pool.request().query(deleteQuery);

    res.status(200).send("Rows deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  } finally {
    connection.closeDatabaseConnection();
  }
};

const getType = async (req, res) => {
  try {
    const pool = await connection.connectToDatabase(); // Get the pool instance
    const result = await pool.request().query("exec spexpensetype 'A','','','',''"); // Use the pool to execute the query
    res.json(result.recordset); // Send the result back to the client
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Internal Server Error"); // Send a 500 response
  }
  // No need to close the connection here
};

const   deleteExpense = async (req, res) => {
  const keyfieldsToDelete = req.body.keyfields;

  if (!keyfieldsToDelete || !keyfieldsToDelete.length) {
    res.status(400).send("Invalid or empty company_nos array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const keyfield of keyfieldsToDelete) {
      try {
        await pool.request().input("keyfield", keyfield)
        .query(`
          EXEC expenses_det_sp 'D','','',0,'','',@keyfield,'','','',''
        `);
      } catch (error) {
        if (error.number === 547) {
          // Foreign key constraint violation
          res.status(400).send(error.message);
          return;
        } else {
          throw error; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).send("Companies deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  } finally {
    connection.closeDatabaseConnection();
  }
};

const login = async (req, res) => {
  const { user_code, user_password } = req.body;
  const secretKey = 'yjk26012024'; 

  try {
    // Decrypt user_code and user_password
    const decryptedUserCode = CryptoJS.AES.decrypt(user_code, secretKey).toString(CryptoJS.enc.Utf8);
    const decryptedPassword = CryptoJS.AES.decrypt(user_password, secretKey).toString(CryptoJS.enc.Utf8);

    // Check if the user exists in the database based on decryptedUserCode
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "LUC")
      .input("user_code", sql.NVarChar, decryptedUserCode)
      .input("user_password", sql.NVarChar, decryptedPassword)
      .query(`EXEC [SP_user_info_hdr] 'LUC',@user_code,'','','',@user_password,'','','','','','','','','','','','','','','',''`);

    if (!result.recordset[0]) {
      // User not found
      return res.status(401).json({ message: "Invalid usercode" });
    } else {
      const user = result.recordset[0]; // Assuming the first record is the user data
      // Check if the provided user_password matches the one in the database
      if (user.user_password !== decryptedPassword) {
        // Passwords don't match
        return res.status(401).json({ message: "Invalid password" });
      } else {
        // Both username and password are validated successfully
        if (result.recordset.length > 0) {
          res.status(200).json(result.recordset); // 200 OK if data is found
        } else {
          res.status(404).send("Data not found"); // 404 Not Found if no data is found
        }
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // Close the connection
    await sql.close();
  }
};



module.exports = {
  login,
  signUp,
  verifyOtp,
  getAllData,
  addData,
  UpdExpensesDetails,
  deleteData,
  getType,
  deleteExpense,
};
