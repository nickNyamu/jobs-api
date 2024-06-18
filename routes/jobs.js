const express = require('express');
const router = express.Router();


const { getAllJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobs');

// router.get('/', getAllJobs);
// router.get('/:id', getJob);
// router.post('/', createJob);
// router.put('/:id', updateJob);
// router.delete('/:id', deleteJob);

router.route('/').post(createJob).get(getAllJobs);
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;