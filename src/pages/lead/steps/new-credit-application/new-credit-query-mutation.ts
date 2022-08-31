// eslint-disable-next-line no-unused-vars
import { NewCreditGlobalState } from './new-credit-controller';

const insertOrUpdatCreditString = (
  clientId: string,
  data: NewCreditGlobalState
): string => {
  return `
    mutation {
        insertOrUpdateCredit(credit: {
          clientId: "${clientId}",
          applicant: {
            civilStatus: "${data.applicant.civilStatus}",
            dateOfBirth: "${data.applicant.dateOfBirth}",
            nationality: "${data.applicant.nationality}",
            placeOfBirth: "${data.applicant.placeOfBirth}",
          },
          applicantActivity: {
            company: "${data.applicantActivity.company}",
            employmentRelationship: "${data.applicantActivity.employmentRelationship}",
            workAddress: "${data.applicantActivity.workAddress}",
            workPhone: "${data.applicantActivity.workPhone}",
            workPosition: "${data.applicantActivity.workPosition}",
            yearsOfWork: ${data.applicantActivity.yearsOfWork}
          },
          currentAddress: {
            cellPhone: "${data.currentAddress.cellPhone}",
            homePhone: "${data.currentAddress.homePhone}",
            houseAddress: "${data.currentAddress.houseAddress}",
            neighborhood: "${data.currentAddress.neighborhood}",
            parish: "${data.currentAddress.parish}",
            typeOfHousing: "${data.currentAddress.typeOfHousing}"
          },
          bankReferences: {
            accountNumber: "${data.bankReferences.accountNumber}",
            accountType: "${data.bankReferences.accountType}",
            bank: "${data.bankReferences.bank}"
          },
          spouseData: {
            dateOfBirth: "${data.spouseData.dateOfBirth}",
            identification: "${data.spouseData.identification}",
            lastNames: "${data.spouseData.lastNames}",
            names: "${data.spouseData.names}",
            placeOfBirth: "${data.spouseData.placeOfBirth}"
          },
          income: {
            monthlySalary: ${data.income.monthlySalary},
            monthlySpouseSalary: ${data.income.monthlySpouseSalary},
            otherIncome: ${data.income.otherSpouseIncome},
            otherSpouseIncome: ${data.income.otherSpouseIncome}
          },
          personalReferences: {
            lastNames: "${data.personalReferences.lastNames}",
            names: "${data.personalReferences.names}",
            phone: "${data.personalReferences.phone}",
            relationship: "${data.personalReferences.relationship}"
          }
        })
      }
    `;
};

export default { insertOrUpdatCreditString };
