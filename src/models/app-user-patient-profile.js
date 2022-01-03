class UserPatientProfile {
    constructor(
        profileId,
        patientName,
        relationship,
        gender,
        age,
        weight,
        medicalCondition,
        knownLanguages,
        dietPreference
    ) {
      this.profileId = profileId;
      this.patientName = patientName;
      this.relationship = relationship;
      this.gender = gender;
      this.age = age;
      this.weight = weight;
      this.medicalCondition = medicalCondition;
      this.knownLanguages = knownLanguages;
      this.dietPreference = dietPreference;
    }
  }
  
  export default UserPatientProfile;