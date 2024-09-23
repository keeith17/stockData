const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// 5분마다 Firestore에서 최근 value를 가져와 계산 후 저장하는 함수
exports.updateRandomValue = functions.pubsub
    .schedule("*/5 * * * *")
    .onRun(async () => {
        const db = admin.firestore();
        const weightedNumbers = [
            2, 1, 2, 1, 3, 1, 5, 1, 4, 2, 1, 5, 1, 5, 1, 2, 3, 4, 5,
        ];

        const randomValue1 =
            weightedNumbers[Math.floor(Math.random() * weightedNumbers.length)];
        const randomValue2 =
            weightedNumbers[Math.floor(Math.random() * weightedNumbers.length)];
        const randomValue3 =
            weightedNumbers[Math.floor(Math.random() * weightedNumbers.length)];
        const randomValue4 =
            weightedNumbers[Math.floor(Math.random() * weightedNumbers.length)];
        const randomValue5 =
            weightedNumbers[Math.floor(Math.random() * weightedNumbers.length)];

        // Firestore에서 가장 최근의 문서 가져오기
        const latestDoc = await db
            .collection("stockValue")
            .orderBy("timestamp", "desc") // 최신 문서부터 정렬
            .limit(1) // 하나만 가져오기
            .get();

        let lastValue1 = 1;
        let lastValue2 = 1;
        let lastValue3 = 1;
        let lastValue4 = 1;
        let lastValue5 = 1;
        if (!latestDoc.empty) {
            const doc = latestDoc.docs[0]; // 가장 최근 문서
            lastValue1 = doc.data().ship1; // 최근 value 값
            lastValue2 = doc.data().ship2; // 최근 value 값
            lastValue3 = doc.data().ship3; // 최근 value 값
            lastValue4 = doc.data().ship4; // 최근 value 값
            lastValue5 = doc.data().ship5; // 최근 value 값
        }

        const newValue1 =
            lastValue1 + randomValue1 >= 25 ? 25 : lastValue1 + randomValue1; // 계산된 새로운 값
        const newValue2 =
            lastValue2 + randomValue2 >= 25 ? 25 : lastValue2 + randomValue2; // 계산된 새로운 값
        const newValue3 =
            lastValue3 + randomValue3 >= 25 ? 25 : lastValue3 + randomValue3; // 계산된 새로운 값
        const newValue4 =
            lastValue4 + randomValue4 >= 25 ? 25 : lastValue4 + randomValue4; // 계산된 새로운 값
        const newValue5 =
            lastValue5 + randomValue5 >= 25 ? 25 : lastValue5 + randomValue5; // 계산된 새로운 값

        // Firestore에 새 문서로 저장
        if (latestDoc.empty) {
            await db.collection("stockValue").add({
                ship1: 1,
                ship2: 1,
                ship3: 1,
                ship4: 1,
                ship5: 1,
                count: 1,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
        } else if (
            latestDoc.docs[0].data().ship1 === 25 ||
            latestDoc.docs[0].data().ship2 === 25 ||
            latestDoc.docs[0].data().ship3 === 25 ||
            latestDoc.docs[0].data().ship4 === 25 ||
            latestDoc.docs[0].data().ship5 === 25
        ) {
            await db.collection("stockValue").add({
                ship1: 1,
                ship2: 1,
                ship3: 1,
                ship4: 1,
                ship5: 1,
                count: latestDoc.docs[0].data().count + 1,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
        } else {
            await db.collection("stockValue").add({
                ship1: newValue1,
                ship2: newValue2,
                ship3: newValue3,
                ship4: newValue4,
                ship5: newValue5,
                count: latestDoc.docs[0].data().count,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
        }

        return null;
    });
