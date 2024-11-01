import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const onPDFs = async (req, res) => {
  try {
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

    const fileSendtoFlask = await axios.post('http://localhost:5000/send', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    res.status(200).json({
      success: true,
      message: "PDF successfully sent to Flask server.",
      response: fileSendtoFlask.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing PDF upload",
      error: error.message,
    });
  }
};

export const onCSVs = async (req, res) => {
  try {
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

    const fileSendtoFlask = await axios.post('http://localhost:5000/send', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    res.status(200).json({
      success: true,
      message: "CSV successfully sent to Flask server.",
      response: fileSendtoFlask.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing CSV upload",
      error: error.message,
    });
  }
};