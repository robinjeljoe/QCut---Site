// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3S50eHZY76Gr7mpA0gCs_I5JWYBmYs0Y",
    authDomain: "qcut-60cec.firebaseapp.com",
    projectId: "qcut-60cec",
    storageBucket: "qcut-60cec.appspot.com",
    messagingSenderId: "42169019245",
    appId: "1:42169019245:web:fc7aa73d8b381dded00864"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  const registrationForm = document.getElementById('registrationForm');
  const registrationData = document.getElementById('registrationData');
  
  registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = registrationForm['name'].value;
    const email = registrationForm['email'].value;
    const password = registrationForm['password'].value;
    const image = registrationForm['image'].files[0];
  
    try {
      // Create user with email and password
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      // Upload image to Firebase Storage
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(`images/${image.name}`);
      await imageRef.put(image);
      const imageUrl = await imageRef.getDownloadURL();
  
      // Update user profile with name and photoURL
      await user.updateProfile({
        displayName: name,
        photoURL: imageUrl
      });
  
      // Display user data
      registrationData.innerHTML = `
        <p>Name: ${user.displayName}</p>
        <p>Email: ${user.email}</p>
        <img src="${user.photoURL}" alt="User Image" style="max-width: 200px;">
      `;
    } catch (error) {
      console.error(error);
      registrationData.innerHTML = `<p id="errorMsg">${error.message}</p>`;
    }
  });
  