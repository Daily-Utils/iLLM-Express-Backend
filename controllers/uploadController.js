import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const onPDFs = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded.",
      });
    }

    const filePath = req.files[0].path;
    const fileName = req.files[0].originalname;


    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), fileName);

    // Send file to Flask server
    const fileSendtoFlask = await axios.post('http://localhost:5000/send', formData, {
      headers: {
        ...formData.getHeaders(), // Use FormData headers
      },
    });

    console.log("fileSendtoFlask::>", fileSendtoFlask.data);
    res.status(200).json({
      success: true,
      message: "File successfully sent to Flask server.",
      response: fileSendtoFlask.data,
    });
  } catch (error) {
    console.error("PDF upload error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error processing upload",
      error: error.message,
    });
  }
};