const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const assertArrays = require("chai-arrays");
chai.use(assertArrays);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
dotenv.config();

const User = require("../../models/user");
const TrackedEntity = require("../../models/trackedEntities/tracked-entity");
const TrackedUser = require("../../models/trackedEntities/tracked-user");

const TrackedEntitiesServices = require("../../services/tracked-entities-services");
const trackedEntitiesServices = require("../../services/tracked-entities-services");
const TrackedItem = require("../../models/trackedEntities/tracked-item");

describe("Services: Tracked Entities Services", () => {
	//create User for Testing
	const emailUser = "test@test.com";
	const nameUser = "testingName";
	const passwordUser = "123fdaR";
	before(async function () {
		await mongoose.connect(
			process.env.DB_TESTING,
			{ useUnifiedTopology: true, useNewUrlParser: true },
			() => console.log("")
		);
		//clean Databases for User and Tracked Entities
		await User.deleteMany({});
		await TrackedEntity.deleteMany({});
		await TrackedUser.deleteMany({});
		//create new User
		const password = passwordUser;
		//Hash passwords
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const user = new User({
			email: emailUser,
			name: nameUser,
			password: hashPassword,
			_id: "5f1aaba0b8ee114a141cd0db",
		});

		await user.save();
	});

	describe("TrackedUsers", () => {
		describe("putTrackedUser(...)", () => {
			it("should throw if userId is of a not existant User", async () => {
				await expect(
					TrackedEntitiesServices.putTrackedUser("5f1aaba0b8ee114a141cd0da", {
						x: 0,
						y: 1,
						z: 2,
					})
				)
					.to.be.rejectedWith(Error)
					.and.eventually.have.property("statusCode")
					.that.equals(403);
			});

			it("should create a new TrackedUser once the call to the function has been made", async () => {
				const numOfTrackedUsers = await TrackedUser.estimatedDocumentCount();
				const trackedUser = await TrackedEntitiesServices.putTrackedUser(
					"5f1aaba0b8ee114a141cd0db",
					{ x: 0, y: 1, z: 2 }
				);
				expect(await TrackedUser.estimatedDocumentCount()).to.be.greaterThan(
					numOfTrackedUsers
				);
			});

			it("should update a the TrackedUser once the call to the function has been made", async () => {
				const numOfTrackedUsers = await TrackedUser.estimatedDocumentCount();
				const trackedUser = await TrackedEntitiesServices.putTrackedUser(
					"5f1aaba0b8ee114a141cd0db",
					{ x: 0, y: 2, z: 3 }
				);
				expect(await TrackedUser.estimatedDocumentCount()).to.equal(
					numOfTrackedUsers
				);
				expect(trackedUser)
					.to.have.property("location")
					.to.have.property("y", 2);
				expect(trackedUser)
					.to.have.property("historicalData")
					.to.be.array()
					.to.have.length(1);
			});
		});

		describe("getTrackedUser(...)", () => {
			before(async () => {
				const user = new User({
					email: "dummy@email.com",
					name: "dummyuser",
					password: "DummyPassword",
					_id: "5f1aaba0b8ee114a141cd0dc",
				});

				await user.save();
			});
			it("should throw if the user is not found", async () => {
				await expect(
					TrackedEntitiesServices.getTrackedUser("5f1aaba0b8ee114a141cd0da")
				)
					.to.be.rejectedWith(Error)
					.and.eventually.have.property("statusCode")
					.that.equals(404);
			});
			it("should throw if the user does not has Tracking Data", async () => {
				await expect(
					TrackedEntitiesServices.getTrackedUser("5f1aaba0b8ee114a141cd0dc")
				)
					.to.be.rejectedWith(Error)
					.and.eventually.have.property("statusCode")
					.that.equals(403);
			});
			it("should return the Tracking data information of the user", async () => {
				const trackedUser = await TrackedEntitiesServices.getTrackedUser(
					"5f1aaba0b8ee114a141cd0db"
				);
				
				expect(trackedUser).to.have.property("location");
				expect(trackedUser).to.have.property("date");
			});
		});
		describe("getTrackedUsers()", () => {
			before(async () => {
				await TrackedUser.deleteMany({});
			});
			it("should throw if there are no Tracked Users", async () => {
				await expect(TrackedEntitiesServices.getTrackedUsers())
					.to.be.rejectedWith(Error)
					.and.eventually.have.property("statusCode")
					.that.equals(404);
			});

			it("should return the list of Tracked Users", async () => {
				await trackedEntitiesServices.putTrackedUser(
					"5f1aaba0b8ee114a141cd0db",
					{ x: 0, y: 2, z: 3 }
				);
				expect(await trackedEntitiesServices.getTrackedUsers())
					.to.be.array()
					.with.length(1);
			});
		});
	});

	describe("TrackedItems", () => {
		describe("putTrackedItem(...)", () => {
			it("should throw if userId is of a not existant User", async () => {
				await expect(
					TrackedEntitiesServices.putTrackedItem(
						"5f1aaba0b8ee114a141cd0da",
						"12345678",
						"TestItem",
						"itemDescription",
						{
							x: 0,
							y: 1,
							z: 2,
						}
					)
				)
					.to.be.rejectedWith(Error)
					.and.eventually.have.property("statusCode")
					.that.equals(403);
			});

			it("should create a new TrackedItem once the call to the function has been made", async () => {
				const numOfTrackedItems = await TrackedItem.estimatedDocumentCount();
				const trackedItem = await TrackedEntitiesServices.putTrackedItem(
					"5f1aaba0b8ee114a141cd0db",
					"12345678",
					"TestItem",
					"itemDescription",
					{
						x: 0,
						y: 1,
						z: 2,
					}
				);
				expect(await TrackedItem.estimatedDocumentCount()).to.be.greaterThan(
					numOfTrackedItems
				);
			});

			it("should update a the TrackedItem once the call to the function has been made", async () => {
				const numOfTrackedItems = await TrackedItem.estimatedDocumentCount();
				const trackedItem = await TrackedEntitiesServices.putTrackedItem(
					"5f1aaba0b8ee114a141cd0db",
					"12345678",
					"TestItemNewName",
					"itemDescriptionNew",
					{
						x: 0,
						y: 1,
						z: 3,
					}
				);
				expect(await TrackedItem.estimatedDocumentCount()).to.equal(
					numOfTrackedItems
				);
				expect(trackedItem).to.have.property("location").to.have.property("y");
				expect(trackedItem)
					.to.have.property("historicalData")
					.to.be.array()
					.to.have.length(1);
				expect(trackedItem).to.have.property("name", "TestItemNewName");
				expect(trackedItem).to.have.property(
					"description",
					"itemDescriptionNew"
				);
			});
		});
		describe("getTrackedItem(...)", async () => {
			it("should throw if the item is not being tracked", async () => {
				await expect(
					TrackedEntitiesServices.getTrackedItem("5f1aaba0b8ee114a141cd0dc")
				)
					.to.be.rejectedWith(Error)
					.and.eventually.have.property("statusCode")
					.that.equals(403);
			});
			it("should trackedItem the Tracking data information of the Item", async () => {
				const trackedItem = await TrackedEntitiesServices.getTrackedItem(
					"12345678"
				);
				
				expect(trackedItem).to.have.property("location");
				expect(trackedItem).to.have.property("date");
				expect(trackedItem).to.have.property(
					"description",
					"itemDescriptionNew"
				);
			});
		});
	});

	after(async function () {
		await User.deleteMany({});
		await TrackedEntity.deleteMany({});
		await TrackedUser.deleteMany({});
		return await mongoose.disconnect();
	});
});
