get one element from firebase
const dbRef = ref(getDatabase());
get(child(dbRef, `users/${userId}`)).then((snapshot) => {
 if (snapshot.exists()) {
	console.log(snapshot.val());
 } else {
	console.log("No data available");
 }
}).catch((error) => {
 	console.error(error);
});
