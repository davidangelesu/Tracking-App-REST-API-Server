const express = require("express");
const router = express.Router();

const projectController = require("../controllers/project");
const beaconsController = require("../controllers/beacon-info");
const verifyBimPlusToken = require("../middlewares/authentication/verifyBimPlusToken");
// const projectValidator = require("../middlewares/validators/user");

//wrapper to catch errors
let wrapper = (fn) => (...args) => fn(...args).catch(args[2]);

/**
 * @api {post} projects Update List of Projects
 * @apiName UpdateProjectList
 * @apiGroup Project
 * @apiDescription Get List of Projects
 *
 * @apiSuccess  (Success 200) {String} message Message indicating status
 *
 * @apiSuccessExample {json} Success-Response
 *   HTTP/1.1 200 OK
 *   {
 *       "message": "Successfully Updated List of Projects.",
 *   }
 *   or
 *   {
 *       "message": "List of Projects up to Date.",
 *   }
 *
 */
router.post(
	"/update",
	verifyBimPlusToken,
	wrapper(projectController.updateProjects)
);

/**
 * @api {get} projects Get List of Projects
 * @apiName Get List Of Projects
 * @apiGroup Project
 * @apiDescription Gets a list of the projects available at Bimplus.
 *
 * @apiSuccess  (Success 200) {Object[]} projects List of all the projects available.
 * @apiSuccessExample {json} Success-Response
 *   HTTP/1.1 200 OK
 *{
 *    "projects": [
 *        {
 *            "id_bimplus": "a7fe022a-bf34-4d73-814a-797eeb5889e6",
 *            "name": "Bimplus Demo",
 *            "slug": "bimplus-demo"
 *        }
 *      ]
 *}
 */
router.get("", verifyBimPlusToken, wrapper(projectController.getProjects));

/**
 * @api {get} projects/:project-id Get Project
 * @apiName Get Project
 * @apiGroup Project
 * @apiDescription Gets information about the Project
 *
 * @apiSuccess  (Success 200) {Object} project returns a JSON object with information about the object
 * @apiSuccessExample {json} Success-Response
 *   HTTP/1.1 200 OK
 *{
 *    "project": {
 *        "_id": "ecbdb0ee-b430-4ac8-a29b-51a36f1e4c45",
 *        "__v": 0,
 *        "models": [
 *            {
 *                "name": "Beacon_Model",
 *                "description": null,
 *                "id_topology": "72678b29-51b4-4fc6-aece-3750fd1ac0bb",
 *                "_id": "36c441e4-383d-47b6-af4e-5d52c1d3b833"
 *            },...
 *        ],
 *        "name": "Logistics",
 *        "slug": "tum-4-ft",
 *        "team_id": null,
 *        "team_name": "Tum - 4",
 *        "beacons_model": {
 *            "beacons": [
 *                {
 *                    "is_active": false,
 *                    "_id": "3fe89152-46fc-428a-ba8a-18a165b92a91",
 *                    "name": "Beacon7:Beacon:2439889",
 *                    "location": {
 *                        "x": -8680.2,
 *                        "y": 6270,
 *                        "z": 7009.4
 *                    }
 *				},...
 *            ],
 *            "_id": "36c441e4-383d-47b6-af4e-5d52c1d3b833"
 *        }
 *    }
 *}
 */
router.get(
	"/:project_id",
	verifyBimPlusToken,
	wrapper(projectController.getProject)
);

/**
 * @api {get} projects/:project-id/models Get List of Models
 * @apiName Get Models
 * @apiGroup Models
 * @apiDescription Gets list of models of current Project
 *
 * 
 * @apiSuccess  (Success 200) {Object[]} models returns a JSON object with the list of available models for selected project
 * @apiSuccessExample {json} Success-Response
 *   HTTP/1.1 200 OK
 *{
 *    "models": [
 *        {
 *            "name": "Beacon_Model",
 *            "description": null,
 *            "id_topology": "72678b29-51b4-4fc6-aece-3750fd1ac0bb",
 *            "_id": "36c441e4-383d-47b6-af4e-5d52c1d3b833"
 *        },
 *        {
 *            "name": "TU Gebäude 2019",
 *            "description": null,
 *            "id_topology": "1c6bcd2f-d1f2-4290-ba11-f443f225a038",
 *            "_id": "ba2ae3d0-f22c-492b-85b9-af0213365df2"
 *        }
 *    ]
 *}
 */
router.get(
	"/:project_id/models",
	verifyBimPlusToken,
	wrapper(projectController.getModels)
);

/**
 * @api {post} projects/:project-id/beacons-model Post Model that contains beacons
 * @apiName Post Beacons Model
 * @apiGroup Models
 * @apiDescription Defines the model that contains the beacons. Extracts the list of beacons from that model. A beacon is considered as any GeometryObject that has beacons in its name.
 *
 * @apiParam {String} model_id Id of the model that contains the beacons.
 * 
 * @apiSuccess  (Success 200) {String} message Indicates success of post.
 * @apiSuccessExample {json} Success-Response
 *   HTTP/1.1 200 OK
 *{
 *  "message": "Successfully set Beacons Model"
 *}
 */
router.post(
	"/:project_id/beacons-model",
	verifyBimPlusToken,
	wrapper(projectController.setBeaconsModel)
);

/**
 * @api {delete} projects/:project-id/beacons-model Removes Model that contains beacons
 * @apiName Delete Beacons Model
 * @apiGroup Models
 * @apiDescription Removes the linkage to the model that contains the beacons. NOTE: Once removed, there is no way to recover information.
 * The information of its beacons is also removed.
 *
 * 
 * @apiSuccess  (Success 200) {String} message Indicates success of the removal.
 * @apiSuccessExample {json} Success-Response
 *   HTTP/1.1 200 OK
 *{
 *  "message": "Successfully Removed Beacons Model"
 *}
 */
router.delete(
	"/:project_id/beacons-model",
	verifyBimPlusToken,
	wrapper(projectController.deleteBeaconsModel)
);


/**
 * @api {get} projects/:project-id/beacons-model get Model that contains beacons
 * @apiName Get Beacons Model
 * @apiGroup Models
 * @apiDescription Obtain the information of the Beacons Model 
 * 
 * @apiSuccess  (Success 200) {Object} beacons_model Contains information about the model and its beacons.
 * @apiSuccessExample {json} Success-Response
 *   HTTP/1.1 200 OK
 *{
 *    "beacons_model": {
 *        "beacons": [
 *            {
 *                "is_active": false,
 *                "_id": "3fe89152-46fc-428a-ba8a-18a165b92a91",
 *                "name": "Beacon7:Beacon:2439889",
 *                "location": {
 *                    "x": -8680.2,
 *                    "y": 6270,
 *                    "z": 7009.4
 *                }
 *            },...
 *        ],
 *        "_id": "36c441e4-383d-47b6-af4e-5d52c1d3b833",
 *        "name": "Beacon_Model",
 *        "description": null,
 *        "id_topology": "72678b29-51b4-4fc6-aece-3750fd1ac0bb"
 *    }
 *}
 */
router.get(
	"/:project_id/beacons-model",
	verifyBimPlusToken,
	wrapper(projectController.getBeaconsModel)
);
module.exports = router;
