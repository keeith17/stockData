/* eslint-disable indent */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// 5분마다 Firestore에서 최근 value를 가져와 계산 후 저장하는 함수
exports.updateRandomValue = functions.pubsub
    .schedule("*/5 * * * *")
    .onRun(async () => {
        const db = admin.firestore();
        const randomValue = 0.8 + Math.random() * 0.4; // 0과 1 사이의 새로운 랜덤 값 생성
        const randomValue2 = 0.8 + Math.random() * 0.4; // 0과 1 사이의 새로운 랜덤 값 생성

        // Firestore에서 가장 최근의 문서 가져오기
        const latestDoc = await db
            .collection("stockValue")
            .orderBy("timestamp", "desc") // 최신 문서부터 정렬
            .limit(1) // 하나만 가져오기
            .get();

        let lastValue = 700; // 기본값 설정 (만약 값이 없을 경우)
        let lastValue2 = 500; // 기본값 설정 (만약 값이 없을 경우)
        if (!latestDoc.empty) {
            const doc = latestDoc.docs[0]; // 가장 최근 문서
            lastValue = doc.data().argo; // 최근 value 값
            lastValue2 = doc.data().arasaka; // 최근 value 값
        }

        const newValue = Math.ceil(lastValue * randomValue); // 계산된 새로운 값
        const newValue2 = Math.ceil(lastValue2 * randomValue2); // 계산된 새로운 값

        // Firestore에 새 문서로 저장
        await db.collection("stockValue").add({
            argo: newValue,
            arasaka: newValue2,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Firestore updated with new value: ${newValue}`);
        return null;
    });
