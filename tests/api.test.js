import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { test } from "../utils/testFixture";


test("Create Post Api", async ({ request, testData }) => {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    let email = faker.internet.email();
    let phone = "+1" + faker.string.numeric(10, { exclude: '1' });
    let birthDate = faker.date.birthdate({ min: 18, max: 100, mode: 'age' }).toISOString().split('T')[0];

    const requestBody = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": "Vfc2023$",
        "isTemporaryPassword": true,
        "phone": phone,
        "gender": "NA",
        "birthDate": birthDate,
        "preferences": {
            "interests": "exploring_the_city"
        },
        "subscriptions" : {
            "newsletterConsent" : true,
            "smsNotificationConsent" : true,
            "loyaltyConsent" : true,
            "loyaltylNewsletterConsent" : true
        }
    };

    console.log("Request Body:", JSON.stringify(requestBody, null, 2));

    const response = await request.post("/data/v2/consumer/signup", {
        data: requestBody
    });

    console.log("Response Status:", response.status());
    console.log("Response Status Text:", response.statusText());

    const responseBody = await response.text();
    console.log("Response Body:", responseBody);

    try {
        const jsonBody = JSON.parse(responseBody);
        console.log("Parsed Response Body:", JSON.stringify(jsonBody, null, 2));
    } catch (e) {
        console.log("Failed to parse response body as JSON");
    }

    expect(response.ok(), `Request failed with status ${response.status()}: ${responseBody}`).toBeTruthy();

    if (response.ok()) {
        const parsedBody = JSON.parse(responseBody);
        expect(parsedBody).toHaveProperty("consumerId");
        testData.email=email;
        testData.consumerId=parsedBody.consumerId;
        testData.firstName=lastName;
        testData.birthDate=birthDate;
    }
});

test("Update Post Api", async ({ request, testData }) => {
     const updateRequestBody = {
        "consumerProfile": {
            "consumerDetails": {
                "lastName": testData.lastName,
                "birthDate": testData.birthDate,
                "consumerId": testData.consumerId,
                
            }
        }
    };
    const response = await request.put(`/data/v2/consumer/${testData.consumerId}`, {
        data: updateRequestBody
    });

    console.log("Update Response Status:", response.status());
    console.log("Update Response Body:", await response.text());

    expect(response.ok()).toBeTruthy();
});