'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

const { Context } = require('fabric-contract-api');
const { ChaincodeStub } = require('fabric-shim');

const ElectronicHealthRecord = require('../lib/electronicHealthRecord.js');

let assert = sinon.assert;
chai.use(sinonChai);

describe('Electronic Health Record Tests', () => {
    let transactionContext, chaincodeStub, patient, doctor, hospital, medicalRecord;

    beforeEach(() => {
        transactionContext = new Context();
        chaincodeStub = sinon.createStubInstance(ChaincodeStub);
        transactionContext.setChaincodeStub(chaincodeStub);

        patient = {
            PatientID: 'patient1',
            FirstName: 'John',
            LastName: 'Doe',
            DateOfBirth: '1990-01-01',
            Gender: 'Male',
            ContactInfo: 'Phone: 555-1234',
        };

        doctor = {
            DoctorID: 'doctor1',
            FirstName: 'Jane',
            LastName: 'Smith',
            Specialization: 'Cardiologist',
            ContactInfo: 'Phone: 555-5678',
            HospitalID: 'hospital1',
        };

        hospital = {
            HospitalID: 'hospital1',
            HospitalName: 'St. Mary Hospital',
            Location: '123 Main St, Cityville',
            ContactInfo: 'Phone: 555-8765',
        };

        medicalRecord = {
            RecordID: 'record1',
            PatientID: 'patient1',
            DoctorID: 'doctor1',
            HospitalID: 'hospital1',
            Date: '2023-01-01',
            Diagnosis: 'Some diagnosis',
            Treatment: 'Some treatment',
            Medications: 'Some medications',
            Notes: 'Some notes',
        };
    });

    describe('Test InitLedger', () => {
        it('should return success on InitLedger', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.InitLedger(transactionContext);

            let ret = JSON.parse((await chaincodeStub.getState('patient1')).toString());
            expect(ret).to.eql(patient);

            ret = JSON.parse((await chaincodeStub.getState('doctor1')).toString());
            expect(ret).to.eql(doctor);

            ret = JSON.parse((await chaincodeStub.getState('hospital1')).toString());
            expect(ret).to.eql(hospital);

            ret = JSON.parse((await chaincodeStub.getState('record1')).toString());
            expect(ret).to.eql(medicalRecord);
        });

        it('should return error on InitLedger', async () => {
            chaincodeStub.putState.rejects('failed inserting key');
            let ehr = new ElectronicHealthRecord();

            try {
                await ehr.InitLedger(transactionContext);
                assert.fail('InitLedger should have failed');
            } catch (err) {
                expect(err.name).to.equal('failed inserting key');
            }
        });
    });

    describe('Test CreatePatient', () => {
        // Similar tests can be written for other Create methods

        it('should return success on CreatePatient', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreatePatient(transactionContext, patient.PatientID, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.Gender, patient.ContactInfo);

            let ret = JSON.parse((await chaincodeStub.getState(patient.PatientID)).toString());
            expect(ret).to.eql(patient);
        });
    });

    describe('Test ReadPatient', () => {
        // Similar tests can be written for other Read methods

        it('should return error on ReadPatient', async () => {
            let ehr = new ElectronicHealthRecord();

            try {
                await ehr.ReadPatient(transactionContext, 'patient2');
                assert.fail('ReadPatient should have failed');
            } catch (err) {
                expect(err.message).to.equal('The patient with ID patient2 does not exist');
            }
        });

        it('should return success on ReadPatient', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreatePatient(transactionContext, patient.PatientID, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.Gender, patient.ContactInfo);

            let ret = JSON.parse(await chaincodeStub.getState(patient.PatientID));
            expect(ret).to.eql(patient);
        });
    });

    describe('Test UpdatePatient', () => {
        // Similar tests can be written for other Update methods

        it('should return error on UpdatePatient', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreatePatient(transactionContext, patient.PatientID, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.Gender, patient.ContactInfo);

            try {
                await ehr.UpdatePatient(transactionContext, 'patient2', 'John', 'Doe', '1990-01-01', 'Male', 'Phone: 555-4321');
                assert.fail('UpdatePatient should have failed');
            } catch (err) {
                expect(err.message).to.equal('The patient with ID patient2 does not exist');
            }
        });

        it('should return success on UpdatePatient', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreatePatient(transactionContext, patient.PatientID, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.Gender, patient.ContactInfo);

            await ehr.UpdatePatient(transactionContext, patient.PatientID, 'John', 'Doe', '1990-01-01', 'Male', 'Phone: 555-4321');
            let ret = JSON.parse(await chaincodeStub.getState(patient.PatientID));
            let expected = {
                PatientID: 'patient1',
                FirstName: 'John',
                LastName: 'Doe',
                DateOfBirth: '1990-01-01',
                Gender: 'Male',
                ContactInfo: 'Phone: 555-4321',
            };
            expect(ret).to.eql(expected);
        });
    });

    describe('Test InitLedger', () => {
        it('should return error on InitLedger', async () => {
            chaincodeStub.putState.rejects('failed inserting key');
            let assetTransfer = new AssetTransfer();
            try {
                await assetTransfer.InitLedger(transactionContext);
                assert.fail('InitLedger should have failed');
            } catch (err) {
                expect(err.name).to.equal('failed inserting key');
            }
        });

        it('should return success on InitLedger', async () => {
            let assetTransfer = new AssetTransfer();
            await assetTransfer.InitLedger(transactionContext);
            let ret = JSON.parse((await chaincodeStub.getState('asset1')).toString());
            expect(ret).to.eql(Object.assign({docType: 'asset'}, asset));
        });
    });

    describe('Test DeletePatient', () => {
        it('should return error on DeletePatient', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreatePatient(transactionContext, patient.PatientID, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.Gender, patient.ContactInfo);

            try {
                await ehr.DeletePatient(transactionContext, 'patient2');
                assert.fail('DeletePatient should have failed');
            } catch (err) {
                expect(err.message).to.equal('The patient with ID patient2 does not exist');
            }
        });

        it('should return success on DeletePatient', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreatePatient(transactionContext, patient.PatientID, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.Gender, patient.ContactInfo);

            await ehr.DeletePatient(transactionContext, patient.PatientID);
            let ret = await chaincodeStub.getState(patient.PatientID);
            expect(ret).to.equal(undefined);
        });
    });

    describe('Test CreateDoctor', () => {
        it('should return success on CreateDoctor', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateHospital(transactionContext, hospital.HospitalID, hospital.HospitalName, hospital.Location, hospital.ContactInfo);

            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            let ret = JSON.parse((await chaincodeStub.getState(doctor.DoctorID)).toString());
            expect(ret).to.eql(Object.assign({}, doctor, { HospitalID: hospital.HospitalID }));
        });

        it('should return error on CreateDoctor with non-existing hospital', async () => {
            let ehr = new ElectronicHealthRecord();
            try {
                await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, 'hospital2');
                assert.fail('CreateDoctor should have failed');
            } catch (err) {
                expect(err.message).to.equal('The hospital with ID hospital2 does not exist');
            }
        });
    });

    describe('Test ReadDoctor', () => {
        it('should return error on ReadDoctor', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            try {
                await ehr.ReadDoctor(transactionContext, 'doctor2');
                assert.fail('ReadDoctor should have failed');
            } catch (err) {
                expect(err.message).to.equal('The doctor with ID doctor2 does not exist');
            }
        });

        it('should return success on ReadDoctor', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            let ret = JSON.parse(await chaincodeStub.getState(doctor.DoctorID));
            expect(ret).to.eql(Object.assign({}, doctor, { HospitalID: hospital.HospitalID }));
        });
    });

    describe('Test UpdateDoctor', () => {
        it('should return error on UpdateDoctor', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            try {
                await ehr.UpdateDoctor(transactionContext, 'doctor2', 'Jane', 'Doe', 'Pediatrician', 'Phone: 555-6789', hospital.HospitalID);
                assert.fail('UpdateDoctor should have failed');
            } catch (err) {
                expect(err.message).to.equal('The doctor with ID doctor2 does not exist');
            }
        });

        it('should return success on UpdateDoctor', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            await ehr.UpdateDoctor(transactionContext, doctor.DoctorID, 'Jane', 'Doe', 'Pediatrician', 'Phone: 555-6789', hospital.HospitalID);
            let ret = JSON.parse(await chaincodeStub.getState(doctor.DoctorID));
            let expected = {
                DoctorID: 'doctor1',
                FirstName: 'Jane',
                LastName: 'Doe',
                Specialization: 'Pediatrician',
                ContactInfo: 'Phone: 555-6789',
                HospitalID: hospital.HospitalID,
            };
            expect(ret).to.eql(expected);
        });
    });

    describe('Test DeleteDoctor', () => {
        it('should return error on DeleteDoctor', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            try {
                await ehr.DeleteDoctor(transactionContext, 'doctor2');
                assert.fail('DeleteDoctor should have failed');
            } catch (err) {
                expect(err.message).to.equal('The doctor with ID doctor2 does not exist');
            }
        });

        it('should return success on DeleteDoctor', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            await ehr.DeleteDoctor(transactionContext, doctor.DoctorID);
            let ret = await chaincodeStub.getState(doctor.DoctorID);
            expect(ret).to.equal(undefined);
        });
    });

    describe('Test CreateHospital', () => {
        it('should return success on CreateHospital', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateHospital(transactionContext, hospital.HospitalID, hospital.HospitalName, hospital.Location, hospital.ContactInfo);

            let ret = JSON.parse((await chaincodeStub.getState(hospital.HospitalID)).toString());
            expect(ret).to.eql(hospital);
        });

        it('should return error on CreateHospital', async () => {
            chaincodeStub.putState.rejects('failed inserting key');
            let ehr = new ElectronicHealthRecord();

            try {
                await ehr.CreateHospital(transactionContext, hospital.HospitalID, hospital.HospitalName, hospital.Location, hospital.ContactInfo);
                assert.fail('CreateHospital should have failed');
            } catch (err) {
                expect(err.name).to.equal('failed inserting key');
            }
        });
    });

    describe('Test ReadHospital', () => {
        it('should return error on ReadHospital', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateHospital(transactionContext, hospital.HospitalID, hospital.HospitalName, hospital.Location, hospital.ContactInfo);

            try {
                await ehr.ReadHospital(transactionContext, 'hospital2');
                assert.fail('ReadHospital should have failed');
            } catch (err) {
                expect(err.message).to.equal('The hospital with ID hospital2 does not exist');
            }
        });

        it('should return success on ReadHospital', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateHospital(transactionContext, hospital.HospitalID, hospital.HospitalName, hospital.Location, hospital.ContactInfo);

            let ret = JSON.parse(await chaincodeStub.getState(hospital.HospitalID));
            expect(ret).to.eql(hospital);
        });
    });

    describe('Test UpdateHospital', () => {
        it('should return error on UpdateHospital', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateHospital(transactionContext, hospital.HospitalID, hospital.HospitalName, hospital.Location, hospital.ContactInfo);

            try {
                await ehr.UpdateHospital(transactionContext, 'hospital2', 'NewName', 'NewLocation', 'Phone: 555-1234');
                assert.fail('UpdateHospital should have failed');
            } catch (err) {
                expect(err.message).to.equal('The hospital with ID hospital2 does not exist');
            }
        });

        it('should return success on UpdateHospital', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateHospital(transactionContext, hospital.HospitalID, hospital.HospitalName, hospital.Location, hospital.ContactInfo);

            await ehr.UpdateHospital(transactionContext, hospital.HospitalID, 'NewName', 'NewLocation', 'Phone: 555-1234');
            let ret = JSON.parse(await chaincodeStub.getState(hospital.HospitalID));
            let expected = {
                HospitalID: 'hospital1',
                HospitalName: 'NewName',
                Location: 'NewLocation',
                ContactInfo: 'Phone: 555-1234',
            };
            expect(ret).to.eql(expected);
        });
    });

    describe('Test CreateDoctor', () => {
        it('should return success on CreateDoctor', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateHospital(transactionContext, hospital.HospitalID, hospital.HospitalName, hospital.Location, hospital.ContactInfo);

            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            let ret = JSON.parse((await chaincodeStub.getState(doctor.DoctorID)).toString());
            expect(ret).to.eql(doctor);
        });

        it('should return error on CreateDoctor', async () => {
            chaincodeStub.putState.rejects('failed inserting key');
            let ehr = new ElectronicHealthRecord();

            try {
                await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);
                assert.fail('CreateDoctor should have failed');
            } catch (err) {
                expect(err.name).to.equal('failed inserting key');
            }
        });
    });
    
    describe('Test CreateAsset', () => {
        it('should return error on CreateAsset', async () => {
            chaincodeStub.putState.rejects('failed inserting key');

            let assetTransfer = new AssetTransfer();
            try {
                await assetTransfer.CreateAsset(transactionContext, asset.ID, asset.Color, asset.Size, asset.Owner, asset.AppraisedValue);
                assert.fail('CreateAsset should have failed');
            } catch(err) {
                expect(err.name).to.equal('failed inserting key');
            }
        });

        it('should return success on CreateAsset', async () => {
            let assetTransfer = new AssetTransfer();

            await assetTransfer.CreateAsset(transactionContext, asset.ID, asset.Color, asset.Size, asset.Owner, asset.AppraisedValue);

            let ret = JSON.parse((await chaincodeStub.getState(asset.ID)).toString());
            expect(ret).to.eql(asset);
        });
    });

    // ... (previous code)

    describe('Test ReadDoctor', () => {
        it('should return error on ReadDoctor', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            try {
                await ehr.ReadDoctor(transactionContext, 'doctor2');
                assert.fail('ReadDoctor should have failed');
            } catch (err) {
                expect(err.message).to.equal('The doctor with ID doctor2 does not exist');
            }
        });

        it('should return success on ReadDoctor', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            let ret = JSON.parse(await chaincodeStub.getState(doctor.DoctorID));
            expect(ret).to.eql(doctor);
        });
    });

    describe('Test UpdateDoctor', () => {
        it('should return error on UpdateDoctor', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            try {
                await ehr.UpdateDoctor(transactionContext, 'doctor2', 'Dr. John', 'Smith', 'Neurologist', 'Email: john.smith@example.com', hospital.HospitalID);
                assert.fail('UpdateDoctor should have failed');
            } catch (err) {
                expect(err.message).to.equal('The doctor with ID doctor2 does not exist');
            }
        });

        it('should return success on UpdateDoctor', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            await ehr.UpdateDoctor(transactionContext, doctor.DoctorID, 'Dr. John', 'Smith', 'Neurologist', 'Email: john.smith@example.com', hospital.HospitalID);
            let ret = JSON.parse(await chaincodeStub.getState(doctor.DoctorID));
            let expected = {
                DoctorID: 'doctor1',
                FirstName: 'Dr. John',
                LastName: 'Smith',
                Specialization: 'Neurologist',
                ContactInfo: 'Email: john.smith@example.com',
                HospitalID: 'hospital1',
            };
            expect(ret).to.eql(expected);
        });
    });

    describe('Test DeleteDoctor', () => {
        it('should return error on DeleteDoctor', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            try {
                await ehr.DeleteDoctor(transactionContext, 'doctor2');
                assert.fail('DeleteDoctor should have failed');
            } catch (err) {
                expect(err.message).to.equal('The doctor with ID doctor2 does not exist');
            }
        });

        it('should return success on DeleteDoctor', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            await ehr.DeleteDoctor(transactionContext, doctor.DoctorID);
            let ret = await chaincodeStub.getState(doctor.DoctorID);
            expect(ret).to.equal(undefined);
        });
    });

    describe('Test Medical Records', () => {
        it('should return success on CreateMedicalRecord', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreatePatient(transactionContext, patient.PatientID, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.Gender, patient.ContactInfo);
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            await ehr.CreateMedicalRecord(transactionContext, 'record1', patient.PatientID, doctor.DoctorID, '2023-01-01', 'Heart checkup', 'Prescription: Aspirin', 'Hospital visit for a routine heart checkup.');

            let ret = JSON.parse((await chaincodeStub.getState('record1')).toString());
            let expected = {
                RecordID: 'record1',
                PatientID: 'patient1',
                DoctorID: 'doctor1',
                Date: '2023-01-01',
                Type: 'Heart checkup',
                Prescription: 'Prescription: Aspirin',
                Note: 'Hospital visit for a routine heart checkup.',
            };
            expect(ret).to.eql(expected);
        });

        it('should return error on CreateMedicalRecord', async () => {
            chaincodeStub.putState.rejects('failed inserting key');
            let ehr = new ElectronicHealthRecord();
            await ehr.CreatePatient(transactionContext, patient.PatientID, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.Gender, patient.ContactInfo);
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            try {
                await ehr.CreateMedicalRecord(transactionContext, 'record1', patient.PatientID, doctor.DoctorID, '2023-01-01', 'Heart checkup', 'Prescription: Aspirin', 'Hospital visit for a routine heart checkup.');
                assert.fail('CreateMedicalRecord should have failed');
            } catch (err) {
                expect(err.name).to.equal('failed inserting key');
            }
        });

        it('should return success on ReadMedicalRecord', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreatePatient(transactionContext, patient.PatientID, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.Gender, patient.ContactInfo);
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);
            await ehr.CreateMedicalRecord(transactionContext, 'record1', patient.PatientID, doctor.DoctorID, '2023-01-01', 'Heart checkup', 'Prescription: Aspirin', 'Hospital visit for a routine heart checkup.');

            let ret = JSON.parse(await chaincodeStub.getState('record1'));
            let expected = {
                RecordID: 'record1',
                PatientID: 'patient1',
                DoctorID: 'doctor1',
                Date: '2023-01-01',
                Type: 'Heart checkup',
                Prescription: 'Prescription: Aspirin',
                Note: 'Hospital visit for a routine heart checkup.',
            };
            expect(ret).to.eql(expected);
        });

        it('should return error on ReadMedicalRecord', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreatePatient(transactionContext, patient.PatientID, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.Gender, patient.ContactInfo);
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);

            try {
                await ehr.ReadMedicalRecord(transactionContext, 'record2');
                assert.fail('ReadMedicalRecord should have failed');
            } catch (err) {
                expect(err.message).to.equal('The medical record with ID record2 does not exist');
            }
        });

        it('should return success on UpdateMedicalRecord', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreatePatient(transactionContext, patient.PatientID, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.Gender, patient.ContactInfo);
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);
            await ehr.CreateMedicalRecord(transactionContext, 'record1', patient.PatientID, doctor.DoctorID, '2023-01-01', 'Heart checkup', 'Prescription: Aspirin', 'Hospital visit for a routine heart checkup.');

            await ehr.UpdateMedicalRecord(transactionContext, 'record1', '2023-02-01', 'Follow-up appointment', 'Prescription: Ibuprofen', 'Follow-up appointment for heart checkup.');
            let ret = JSON.parse(await chaincodeStub.getState('record1'));
            let expected = {
                RecordID: 'record1',
                PatientID: 'patient1',
                DoctorID: 'doctor1',
                Date: '2023-02-01',
                Type: 'Follow-up appointment',
                Prescription: 'Prescription: Ibuprofen',
                Note: 'Follow-up appointment for heart checkup.',
            };
            expect(ret).to.eql(expected);
        });

        it('should return error on UpdateMedicalRecord', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreatePatient(transactionContext, patient.PatientID, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.Gender, patient.ContactInfo);
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);
            await ehr.CreateMedicalRecord(transactionContext, 'record1', patient.PatientID, doctor.DoctorID, '2023-01-01', 'Heart checkup', 'Prescription: Aspirin', 'Hospital visit for a routine heart checkup.');

            try {
                await ehr.UpdateMedicalRecord(transactionContext, 'record2', '2023-02-01', 'Follow-up appointment', 'Prescription: Ibuprofen', 'Follow-up appointment for heart checkup.');
                assert.fail('UpdateMedicalRecord should have failed');
            } catch (err) {
                expect(err.message).to.equal('The medical record with ID record2 does not exist');
            }
        });

        it('should return success on DeleteMedicalRecord', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreatePatient(transactionContext, patient.PatientID, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.Gender, patient.ContactInfo);
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);
            await ehr.CreateMedicalRecord(transactionContext, 'record1', patient.PatientID, doctor.DoctorID, '2023-01-01', 'Heart checkup', 'Prescription: Aspirin', 'Hospital visit for a routine heart checkup.');

            await ehr.DeleteMedicalRecord(transactionContext, 'record1');
            let ret = await chaincodeStub.getState('record1');
            expect(ret).to.equal(undefined);
        });

        it('should return error on DeleteMedicalRecord', async () => {
            let ehr = new ElectronicHealthRecord();
            await ehr.CreatePatient(transactionContext, patient.PatientID, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.Gender, patient.ContactInfo);
            await ehr.CreateDoctor(transactionContext, doctor.DoctorID, doctor.FirstName, doctor.LastName, doctor.Specialization, doctor.ContactInfo, hospital.HospitalID);
            await ehr.CreateMedicalRecord(transactionContext, 'record1', patient.PatientID, doctor.DoctorID, '2023-01-01', 'Heart checkup', 'Prescription: Aspirin', 'Hospital visit for a routine heart checkup.');

            try {
                await ehr.DeleteMedicalRecord(transactionContext, 'record2');
                assert.fail('DeleteMedicalRecord should have failed');
            } catch (err) {
                expect(err.message).to.equal('The medical record with ID record2 does not exist');
            }
        });
    });

    // ... (remaining code)
});


