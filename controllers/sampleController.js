import Errorhandler from '../Utils/Errorhandler.js';
import TryCatch from '../Utils/TryCatch.js';

export const getSampleData = TryCatch( async (req, res, next) => {
    // Simulating async operation
    const data = await new Promise((resolve, reject) => {
        setTimeout(() => {
            const random = Math.random();
            if (random > 0.5) resolve({ message: 'Sample data fetched successfully!' });
            else reject(new Errorhandler('Something went wrong!', 500));
        }, 1000);
    });

    res.status(200).json({ success: true, data });
});
