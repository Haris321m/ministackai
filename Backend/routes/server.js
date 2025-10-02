import chatcompletionsRouter from './chatcompletion.route.js';
import userroute from './user.route.js';
import planroute from './plan.route.js';
import usagelimitroute from './usagelimit.route.js';
import usagelogsroute from './usagelogs.route.js';
import userplanroute from './userplan.route.js';
import modelroute from './model.route.js';
import conservationroute from './conversation.route.js';
import chatroute from './chat.route.js';
import billingroute from './billing.route.js';
import applinglimits from './applinglimits.route.js';
import otproute from "./otp.route.js";
import express from 'express';

const router = express.Router();

router.use('/chatcompletions', chatcompletionsRouter);
router.use('/users', userroute);
router.use('/plans', planroute);
router.use('/usagelimits', usagelimitroute);
router.use('/usagelogs', usagelogsroute);
router.use('/userplans', userplanroute);
router.use('/models', modelroute);
router.use('/conservations', conservationroute);
router.use('/chats', chatroute);
router.use('/billing', billingroute);
router.use('/limits',applinglimits);
router.use('/otp',otproute)

export default router;