/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ElectronicHealthRecord extends Contract {

    async InitLedger(ctx) {
        const patients = [
            {
                PatientID: 'P001',
                FirstName: 'John',
                LastName: 'Doe',
                DateOfBirth: '1990-01-15',
                Gender: 'Male',
                ContactInfo: '123-456-7890',
            },
            {
                PatientID: 'P002',
                FirstName: 'Jane',
                LastName: 'Smith',
                DateOfBirth: '1985-08-22',
                Gender: 'Female',
                ContactInfo: '987-654-3210',
            },
            // Add more patient data as needed
        ];
    
        const doctors = [
            {
                DoctorID: 'D001',
                FirstName: 'John',
                LastName: 'Doe',
                Specialization: 'Cardiologist',
                ContactInfo: 'Phone: 555-1111',
                HospitalID: 'H001',  // Specify the HospitalID for the doctor
            },
            {
                DoctorID: 'D002',
                FirstName: 'Jane',
                LastName: 'Smith',
                Specialization: 'Pediatrician',
                ContactInfo: 'Phone: 555-2222',
                HospitalID: 'H002',  // Specify the HospitalID for the doctor
            },
            // Add more doctors as needed
        ];
    
        const hospitals = [
            {
                HospitalID: 'H001',
                HospitalName: 'City General Hospital',
                Location: '123 Main Street, City',
                ContactInfo: '111-222-3333',
            },
            {
                HospitalID: 'H002',
                HospitalName: 'Suburb Medical Center',
                Location: '456 Oak Avenue, Suburb',
                ContactInfo: '222-333-4444',
            },
            // Add more hospital data as needed
        ];
    
        const medicalRecords = [
            {
                RecordID: 'M001',
                PatientID: 'P001',
                DoctorID: 'D001',
                HospitalID: 'H001',
                Date: '2023-01-01',
                Diagnosis: 'Hypertension',
                Treatment: 'Prescription medication, lifestyle changes',
                Medications: 'Lisinopril',
                Notes: 'Follow up in 3 months',
            },
            {
                RecordID: 'M002',
                PatientID: 'P002',
                DoctorID: 'D002',
                HospitalID: 'H002',
                Date: '2023-02-15',
                Diagnosis: 'Common cold',
                Treatment: 'Rest, fluids, over-the-counter medication',
                Medications: 'Ibuprofen, decongestant',
                Notes: 'Patient advised to rest at home',
            },
            // Add more medical record data as needed
        ];

        // Create accounts for patients, doctors, and hospitals
        const accounts = [
            {
                Username: 'patient1',
                Password: 'password1',
                UserType: 'patient',
                UserID: 'P001', // Corresponding PatientID
            },
            {
                Username: 'patient2',
                Password: 'password2',
                UserType: 'patient',
                UserID: 'P002', // Corresponding PatientID
            },
            {
                Username: 'doctor1',
                Password: 'password1',
                UserType: 'doctor',
                UserID: 'D001', // Corresponding DoctorID
            },
            {
                Username: 'doctor2',
                Password: 'password2',
                UserType: 'doctor',
                UserID: 'D002', // Corresponding DoctorID
            },
            {
                Username: 'hospital1',
                Password: 'password1',
                UserType: 'hospital',
                UserID: 'H001', // Corresponding HospitalID
            },
            {
                Username: 'hospital2',
                Password: 'password2',
                UserType: 'hospital',
                UserID: 'H002', // Corresponding HospitalID
            },
            // Add more accounts as needed
        ];

        const logChanges = [
            {
                Timestamp: '2023-12-10T18:51:29.637+07:00',
                Username: 'patient1',
                UserType: 'patient',
                UserID: 'P001', // Corresponding PatientID
            },
            {
                Timestamp: '2023-12-10T18:52:10.468+07:00',
                Username: 'patient2',
                UserType: 'patient',
                UserID: 'P002', // Corresponding PatientID
            },
        ];

        // Patient
        for (const patient of patients) {
            patient.docType = 'patient';
            await ctx.stub.putState(patient.PatientID, Buffer.from(JSON.stringify(patient)));
            console.info(`Patient ${patient.PatientID} initialized`);
        }
        // Doctor
        for (const doctor of doctors) {
            doctor.docType = 'doctor';
            await ctx.stub.putState(doctor.DoctorID, Buffer.from(JSON.stringify(doctor)));
            console.info(`Doctor ${doctor.DoctorID} initialized`);
        }
        // Hospital
        for (const hospital of hospitals) {
            hospital.docType = 'hospital';
            await ctx.stub.putState(hospital.HospitalID, Buffer.from(JSON.stringify(hospital)));
            console.info(`Hospital ${hospital.HospitalID} initialized`);
        }
        // Medical Record
        for (const medicalRecord of medicalRecords) {
            medicalRecord.docType = 'medicalRecord';
            await ctx.stub.putState(medicalRecord.RecordID, Buffer.from(JSON.stringify(medicalRecord)));
            console.info(`Medical Record ${medicalRecord.RecordID} initialized`);
        }
        
        // Create accounts for users
        for (const account of accounts) {
            account.docType = 'account';
            await ctx.stub.putState(account.Username, Buffer.from(JSON.stringify(account)));
            console.info(`Account ${account.Username} initialized`);
        }

        for (const logChange of logChanges) {
            logChange.docType = 'logChange';
            await ctx.stub.putState(logChange.Timestamp, Buffer.from(JSON.stringify(logChange)));
            console.info(`Log Change ${logChange.Timestamp} initialized`);
        }
    }

    // CreateAccount creates a new user account in the world state.
    async CreateAccount(ctx, username, password, userType, userID) {
        const account = {
            Username: username,
            Password: password,
            UserType: userType, // 'patient', 'doctor', or 'hospital'
            UserID: userID, // ID of the corresponding user (patientID, doctorID, or hospitalID)
            docType: 'account',
        };
        ctx.stub.putState(username, Buffer.from(JSON.stringify(account)));
        return JSON.stringify(account);
    }

    // AccountExists returns true when an account with the given username exists in the world state.
    async AccountExists(ctx, username) {
        const accountJSON = await ctx.stub.getState(username);
        return accountJSON && accountJSON.length > 0;
    }

    // UpdateAccount updates an existing account in the world state with provided parameters.
    async UpdateAccount(ctx, username, password, userType, userID, timestamp) {
        const exists = await this.AccountExists(ctx, username);
        if (!exists) {
            throw new Error(`The account with username ${username} does not exist`);
        }

        // overwriting original account with new account data
        const updatedAccount = {
            Username: username,
            Password: password,
            UserType: userType,
            UserID: userID,
            docType: 'account',
        };

        // Log the change
        await this.CreateLogChange(ctx, 'account', userID, username, timestamp);

        return ctx.stub.putState(username, Buffer.from(JSON.stringify(updatedAccount)));
    }
    
    // DeleteAccount deletes a given account from the world state.
    async DeleteAccount(ctx, username) {
        const exists = await this.AccountExists(ctx, username);
        if (!exists) {
            throw new Error(`The account with username ${username} does not exist`);
        }
        return ctx.stub.deleteState(username);
    }

    // AuthenticateUser authenticates a user based on the provided username and password.
    async AuthenticateUser(ctx, username, password, userType) {
        const accountJSON = await ctx.stub.getState(username);
        if (!accountJSON || accountJSON.length === 0) {
            throw new Error(`The account with username ${username} does not exist`);
        }

        const account = JSON.parse(accountJSON.toString());

        if (account.Password !== password || account.UserType !== userType) {
            throw new Error(`Authentication failed for username ${username}`);
        }

        return JSON.stringify(account);
    }

    // CreatePatient creates a new patient in the world state.
    async CreatePatient(ctx, username, password, patientID, firstName, lastName, dateOfBirth, gender, contactInfo) {
        // Check if the username is unique
        const accountExists = await this.AccountExists(ctx, username);
        if (accountExists) {
            throw new Error(`An account with username ${username} already exists`);
        }

        // Create the patient account
        await this.CreateAccount(ctx, username, password, 'patient', patientID);

        const patient = {
            PatientID: patientID,
            FirstName: firstName,
            LastName: lastName,
            DateOfBirth: dateOfBirth,
            Gender: gender,
            ContactInfo: contactInfo,
            docType: 'patient',
        };
        await ctx.stub.putState(patientID, Buffer.from(JSON.stringify(patient)));
        return JSON.stringify(patient);
    }

    // ReadPatient returns the patient stored in the world state with the given patientID.
    async ReadPatient(ctx, patientID) {
        const patientJSON = await ctx.stub.getState(patientID);
        if (!patientJSON || patientJSON.length === 0) {
            throw new Error(`The patient with ID ${patientID} does not exist`);
        }
        return patientJSON.toString();
    }

    // UpdatePatient updates an existing patient in the world state with provided parameters.
    async UpdatePatient(ctx, patientID, firstName, lastName, dateOfBirth, gender, contactInfo, username, timestamp) {
        const exists = await this.PatientExists(ctx, patientID);
        if (!exists) {
            throw new Error(`The patient with ID ${patientID} does not exist`);
        }

        // overwriting original patient with new patient data
        const updatedPatient = {
            PatientID: patientID,
            FirstName: firstName,
            LastName: lastName,
            DateOfBirth: dateOfBirth,
            Gender: gender,
            ContactInfo: contactInfo,
            docType: 'patient',
        };

        // Log the change
        await this.CreateLogChange(ctx, 'patient', patientID, username, timestamp);
  
        return await ctx.stub.putState(patientID, Buffer.from(JSON.stringify(updatedPatient)));
    }

    // DeletePatient deletes a given patient from the world state.
    async DeletePatient(ctx, patientID) {
        const exists = await this.PatientExists(ctx, patientID);
        if (!exists) {
            throw new Error(`The patient with ID ${patientID} does not exist`);
        }
        return ctx.stub.deleteState(patientID);
    }

    // PatientExists returns true when a patient with the given ID exists in the world state.
    async PatientExists(ctx, patientID) {
        const patientJSON = await ctx.stub.getState(patientID);
        return patientJSON && patientJSON.length > 0;
    }

    // CreateDoctor creates a new doctor in the world state.
    async CreateDoctor(ctx, username, password, doctorID, firstName, lastName, specialization, contactInfo, hospitalID) {
        // Check if the username is unique
        const accountExists = await this.AccountExists(ctx, username);
        if (accountExists) {
            throw new Error(`An account with username ${username} already exists`);
        }

        // Check if the hospital exists
        await this.HospitalExists(ctx, hospitalID);

        // Create the doctor account
        await this.CreateAccount(ctx, username, password, 'doctor', doctorID);

        const doctor = {
            DoctorID: doctorID,
            FirstName: firstName,
            LastName: lastName,
            Specialization: specialization,
            ContactInfo: contactInfo,
            HospitalID: hospitalID,
            docType: 'doctor',
        };
        await ctx.stub.putState(doctorID, Buffer.from(JSON.stringify(doctor)));
        return JSON.stringify(doctor);
    }

    async ReadDoctor(ctx, doctorID) {
        const doctorJSON = await ctx.stub.getState(doctorID);
        if (!doctorJSON || doctorJSON.length === 0) {
            throw new Error(`The doctor with ID ${doctorID} does not exist`);
        }
        return doctorJSON.toString();
    }

    // UpdateDoctor updates an existing doctor in the world state with provided parameters.
    async UpdateDoctor(ctx, doctorID, firstName, lastName, specialization, contactInfo, hospitalID, username, timestamp) {
        const exists = await this.DoctorExists(ctx, doctorID);
        if (!exists) {
            throw new Error(`The doctor with ID ${doctorID} does not exist`);
        }

        // Check if the hospital exists
        await this.HospitalExists(ctx, hospitalID);

        // overwriting original doctor with new doctor data
        const updatedDoctor = {
            DoctorID: doctorID,
            FirstName: firstName,
            LastName: lastName,
            Specialization: specialization,
            ContactInfo: contactInfo,
            HospitalID: hospitalID,
            docType: 'doctor',
        };

        // Log the change
        await this.CreateLogChange(ctx, 'doctor', doctorID, username, timestamp);

        return await ctx.stub.putState(doctorID, Buffer.from(JSON.stringify(updatedDoctor)));
    }

    // DeleteDoctor deletes a given doctor from the world state.
    async DeleteDoctor(ctx, doctorID) {
        const exists = await this.DoctorExists(ctx, doctorID);
        if (!exists) {
            throw new Error(`The doctor with ID ${doctorID} does not exist`);
        }
        return ctx.stub.deleteState(doctorID);
    }

    // DoctorExists returns true when a doctor with the given ID exists in the world state.
    async DoctorExists(ctx, doctorID) {
        const doctorJSON = await ctx.stub.getState(doctorID);
        return doctorJSON && doctorJSON.length > 0;
    }

    // CreateHospital creates a new hospital in the world state.
    async CreateHospital(ctx, username, password, hospitalID, hospitalName, location, contactInfo) {
        // Check if the username is unique
        const accountExists = await this.AccountExists(ctx, username);
        if (accountExists) {
            throw new Error(`An account with username ${username} already exists`);
        }

        // Create the hospital account
        await this.CreateAccount(ctx, username, password, 'hospital', hospitalID);

        const hospital = {
            HospitalID: hospitalID,
            HospitalName: hospitalName,
            Location: location,
            ContactInfo: contactInfo,
            docType: 'hospital',
        };
        await ctx.stub.putState(hospitalID, Buffer.from(JSON.stringify(hospital)));
        return JSON.stringify(hospital);
    }

    // ReadHospital returns the hospital stored in the world state with the given hospitalID.
    async ReadHospital(ctx, hospitalID) {
        const hospitalJSON = await ctx.stub.getState(hospitalID);
        if (!hospitalJSON || hospitalJSON.length === 0) {
            throw new Error(`The hospital with ID ${hospitalID} does not exist`);
        }
        return hospitalJSON.toString();
    }

    // UpdateHospital updates an existing hospital in the world state with provided parameters.
    async UpdateHospital(ctx, hospitalID, hospitalName, location, contactInfo, username, timestamp) {
        const exists = await this.HospitalExists(ctx, hospitalID);
        if (!exists) {
            throw new Error(`The hospital with ID ${hospitalID} does not exist`);
        }

        // overwriting original hospital with new hospital data
        const updatedHospital = {
            HospitalID: hospitalID,
            HospitalName: hospitalName,
            Location: location,
            ContactInfo: contactInfo,
            docType: 'hospital',
        };

        // Log the change
        await this.CreateLogChange(ctx, 'hospital', hospitalID, username, timestamp);

        return await ctx.stub.putState(hospitalID, Buffer.from(JSON.stringify(updatedHospital)));
    }

    // DeleteHospital deletes a given hospital from the world state.
    async DeleteHospital(ctx, hospitalID) {
        const exists = await this.HospitalExists(ctx, hospitalID);
        if (!exists) {
            throw new Error(`The hospital with ID ${hospitalID} does not exist`);
        }
        return ctx.stub.deleteState(hospitalID);
    }

    // HospitalExists returns true when a hospital with the given ID exists in the world state.
    async HospitalExists(ctx, hospitalID) {
        const hospitalJSON = await ctx.stub.getState(hospitalID);
        return hospitalJSON && hospitalJSON.length > 0;
    }

    // CreateMedicalRecord creates a new medical record in the world state.
    async CreateMedicalRecord(ctx, recordID, patientID, doctorID, hospitalID, date, diagnosis, treatment, medications, notes) {
        // Check if patient, doctor, and hospital exist
        await this.ValidatePatientDoctorHospital(ctx, patientID, doctorID, hospitalID);

        const medicalRecord = {
            RecordID: recordID,
            PatientID: patientID,
            DoctorID: doctorID,
            HospitalID: hospitalID,
            Date: date,
            Diagnosis: diagnosis,
            Treatment: treatment,
            Medications: medications,
            Notes: notes,
            docType: 'medicalRecord',
        };
        await ctx.stub.putState(recordID, Buffer.from(JSON.stringify(medicalRecord)));
        return JSON.stringify(medicalRecord);
    }

    // ReadMedicalRecord returns the medical record stored in the world state with the given recordID.
    async ReadMedicalRecord(ctx, recordID) {
        const medicalRecordJSON = await ctx.stub.getState(recordID);
        if (!medicalRecordJSON || medicalRecordJSON.length === 0) {
            throw new Error(`The medical record with ID ${recordID} does not exist`);
        }
        return medicalRecordJSON.toString();
    }

    // UpdateMedicalRecord updates an existing medical record in the world state with provided parameters.
    async UpdateMedicalRecord(ctx, recordID, patientID, doctorID, hospitalID, date, diagnosis, treatment, medications, notes, username, timestamp) {
        const exists = await this.MedicalRecordExists(ctx, recordID);
        if (!exists) {
            throw new Error(`The medical record with ID ${recordID} does not exist`);
        }

        // Check if patient, doctor, and hospital exist
        await this.ValidatePatientDoctorHospital(ctx, patientID, doctorID, hospitalID);

        // overwriting original medical record with new data
        const updatedMedicalRecord = {
            RecordID: recordID,
            PatientID: patientID,
            DoctorID: doctorID,
            HospitalID: hospitalID,
            Date: date,
            Diagnosis: diagnosis,
            Treatment: treatment,
            Medications: medications,
            Notes: notes,
            docType: 'medicalRecord',
        };

        // Log the change
        await this.CreateLogChange(ctx, 'medicalrecord', recordID, username, timestamp);

        return await ctx.stub.putState(recordID, Buffer.from(JSON.stringify(updatedMedicalRecord)));
    }

    // DeleteMedicalRecord deletes a given medical record from the world state.
    async DeleteMedicalRecord(ctx, recordID) {
        const exists = await this.MedicalRecordExists(ctx, recordID);
        if (!exists) {
            throw new Error(`The medical record with ID ${recordID} does not exist`);
        }
        return ctx.stub.deleteState(recordID);
    }

    // MedicalRecordExists returns true when a medical record with the given ID exists in the world state.
    async MedicalRecordExists(ctx, recordID) {
        const medicalRecordJSON = await ctx.stub.getState(recordID);
        return medicalRecordJSON && medicalRecordJSON.length > 0;
    }

    // Helper function to validate if the patient, doctor, and hospital exist before creating a medical record.
    async ValidatePatientDoctorHospital(ctx, patientID, doctorID, hospitalID) {
        const patientExists = await this.PatientExists(ctx, patientID);
        if (!patientExists) {
            throw new Error(`The patient with ID ${patientID} does not exist`);
        }

        const doctorExists = await this.DoctorExists(ctx, doctorID);
        if (!doctorExists) {
            throw new Error(`The doctor with ID ${doctorID} does not exist`);
        }

        const hospitalExists = await this.HospitalExists(ctx, hospitalID);
        if (!hospitalExists) {
            throw new Error(`The hospital with ID ${hospitalID} does not exist`);
        }
    }

    // Modified helper function to get all entities of a given type from the world state using a range query.
    async GetAllEntities(ctx, entityType) {
        const allResults = [];
        // Range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            // Check if the record has the expected docType before adding it to the results.
            if (record.docType === entityType) {
                allResults.push({ Key: result.value.key, Record: record });
            }
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    // Modified GetAllPatients function
    async GetAllPatients(ctx) {
        return this.GetAllEntities(ctx, 'patient');
    }

    // Modified GetAllDoctors function
    async GetAllDoctors(ctx) {
        return this.GetAllEntities(ctx, 'doctor');
    }

    // Modified GetAllHospitals function
    async GetAllHospitals(ctx) {
        return this.GetAllEntities(ctx, 'hospital');
    }

    // Modified GetAllMedicalRecords function
    async GetAllMedicalRecords(ctx) {
        return this.GetAllEntities(ctx, 'medicalRecord');
    }
    
    // ReadAllAccounts returns all accounts stored in the world state.
    async ReadAllAccounts(ctx) {
        return this.GetAllEntities(ctx, 'account');
    }

    async GetAllLogChanges(ctx) {
        return this.GetAllEntities(ctx, 'logChange');
    }

    // Function to get all Medical Records for a given PatientID
    async GetMedicalRecordsByPatientID(ctx, patientID) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            // Check if the record has the expected docType and matches the provided PatientID
            if (record.docType === 'medicalRecord' && record.PatientID === patientID) {
                allResults.push({ Key: result.value.key, Record: record });
            }
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

      // Common function to log changes
    async CreateLogChange(ctx, userType, userID, username, timestamp) {

        // Create a log entry
        const logChange = {
        Timestamp: timestamp,
        Username: username,
        UserType: userType,
        UserID: userID,
        docType: 'logChange',
        };

        // Store the log entry in a separate state (you need to implement this state)
        await ctx.stub.putState(timestamp, Buffer.from(JSON.stringify(logChange)));
        return JSON.stringify(logChange);
    }

    
}

module.exports = ElectronicHealthRecord;