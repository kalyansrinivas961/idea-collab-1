const mongoose = require("mongoose");
const Report = require("./src/models/Report");
require("dotenv").config();

const checkReports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    
    const count = await Report.countDocuments();
    console.log("Total reports:", count);
    
    if (count > 0) {
      const reports = await Report.find().limit(5);
      reports.forEach(r => console.log(`Report: ${r.referenceNumber} - ${r._id}`));
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

checkReports();
