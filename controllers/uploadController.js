import axios from "axios";
import PDFModel from "../models/PDF.js";

export const onPDFs = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded.",
      });
    }

    console.log("req.file", req.files);
    const formData=new FormData();
    formData.append("file",req.files[0]);

    const fileSendtoFlask = await axios.post(
      "http://localhost:5000/send",
      
        formData
      ,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("fileSendtoFlask::>", fileSendtoFlask);
  } catch (error) {
    console.error("PDF upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing upload",
      error: error.message,
    });
  }
};
