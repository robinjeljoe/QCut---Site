var firebaseConfig = {
    apiKey: "AIzaSyC3S50eHZY76Gr7mpA0gCs_I5JWYBmYs0Y",
    authDomain: "qcut-60cec.firebaseapp.com",
    projectId: "qcut-60cec",
    storageBucket: "qcut-60cec.appspot.com",
    messagingSenderId: "42169019245",
    appId: "1:42169019245:web:fc7aa73d8b381dded00864"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

function getname(sid) {
    return new Promise((resolve, reject) => {
        db.collection("usernames").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const sa = data.sid.toString();
                const name = data.name.toString();
                console.log(sid);
                console.log(sa);
                if (sa === sid) {
                    console.log(name);
                    resolve(name); // Resolve the promise with the name
                }
            });
            // If the sid is not found, resolve with null
            resolve(null);
        }).catch((error) => {
            // Reject the promise if there's an error
            reject(error);
        });
    });
}
function hiderman(){
    document.getElementById('viewDataBtn').style.display="none";
}


auth.onAuthStateChanged((user) => {
    if (user) {
        const userId = user.uid;
        const userEmail = user.email.toString();
        const userna = userEmail.split('@')[0];
        const userName = user.displayName;
        photo = user.photoURL;
        document.getElementById("abc").innerHTML = userName;
        document.getElementById('us').src = photo;
        
        // Also set the logo and shop name in the bill header
        document.getElementById('bill-logo').src = photo;
        document.getElementById('bill-shop-name').textContent = userName;

        const viewDataBtn = document.getElementById('viewDataBtn');
        const dataContainer = document.getElementById('data-container');
        const summaryContainer = document.getElementById('summary-container');

        function loadOrderSummary() {
            db.collection(userna).get()
                .then((querySnapshot) => {
                    summaryContainer.innerHTML = ''; // Clear previous data
                    
                    const cardHeader = document.createElement('div');
                    cardHeader.className = 'card-header';
                    cardHeader.innerHTML = '<h2>Orders Summary</h2>';
                    summaryContainer.appendChild(cardHeader);
                    
                    // Create card body
                    const cardBody = document.createElement('div');
                    cardBody.className = 'card-body';
                    summaryContainer.appendChild(cardBody);

                    // Create an object to store data grouped by sid
                    const groupedData = {};

                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const sid = data.sid;

                        // If the sid is not present in groupedData, initialize it as an empty array
                        if (!groupedData[sid]) {
                            groupedData[sid] = [];
                        }

                        // Add document ID to the data object for reference
                        data.docId = doc.id;
                        groupedData[sid].push(data);
                    });
                    const tableContainer = document.createElement('div');
                    tableContainer.className = 'table-container';
                    cardBody.appendChild(tableContainer);

                    // Create summary table
                    const table = document.createElement('table');
                    table.classList.add('summary-table');
                    
                    // Create table header
                    const thead = document.createElement('thead');
                    const headerRow = document.createElement('tr');
                    headerRow.innerHTML = `
                        <th>Sl No</th>
                        <th>Order ID</th>
                        <th>Name</th>
                        <th>Total Amount</th>
                        <th>Action</th>
                    `;
                    thead.appendChild(headerRow);
                    table.appendChild(thead);
                    
                    // Create table body
                    const tbody = document.createElement('tbody');
                    let slNo = 1;
                    if (Object.keys(groupedData).length === 0) {
                        const noOrdersRow = document.createElement('tr');
                        noOrdersRow.innerHTML = '<td colspan="5" style="text-align: center; padding: 20px;">No orders found</td>';
                        tbody.appendChild(noOrdersRow);
                    }
                    
                    // Process each order group
                    const promises = Object.keys(groupedData).map(sid => {
                        return getname(sid).then(name => {
                            if (name !== null) {
                                const items = groupedData[sid];
                                let totalAmount = 0;
                                
                                // Calculate total amount for this order
                                items.forEach(item => {
                                    if (item.price && item.qty) {
                                        totalAmount += (item.price * item.qty);
                                    }
                                });
                                
                                // Only display if total amount is greater than 0
                                if (totalAmount > 0) {
                                    const row = document.createElement('tr');
                                    row.innerHTML = `
                                        <td>${slNo}</td>
                                        <td>${sid}</td>
                                        <td>${name}</td>
                                        <td>₹${totalAmount.toFixed(2)}</td>
                                        <td>
                                            <button class="generate-bill-btn" data-sid="${sid}">Generate Bill</button>
                                            <button class="custom-btn" data-sid="${sid}">Delete</button>
                                        </td>
                                    `;
                                    tbody.appendChild(row);
                                    slNo++;
                                }
                                
                                // Store the items in a data attribute for later use
                                return { sid, name, items, totalAmount };
                            }
                            return null;
                        });
                    });
                    
                    Promise.all(promises).then(results => {
                        // Filter out null results
                        const validResults = results.filter(result => result !== null);
                        
                        // Add event listeners after all rows are created
                        table.appendChild(tbody);
                        summaryContainer.appendChild(table);
                        
                        // Add event listeners for Generate Bill buttons
                        const generateBillBtns = document.querySelectorAll('.generate-bill-btn');
                        generateBillBtns.forEach(btn => {
                            btn.addEventListener('click', function() {
                                const sid = this.getAttribute('data-sid');
                                document.getElementById('signout').style.display="none";
                                document.getElementById('header').style.display="none";
                                const orderData = validResults.find(item => item.sid === sid);
                                if (orderData) {
                                    generateBill(orderData.name, sid, orderData.items);
                                }
                            });
                        });
                        
                        // Add event listeners for Delete buttons
                        const deleteBtns = document.querySelectorAll('.custom-btn');
                        deleteBtns.forEach(btn => {
                            btn.addEventListener('click', function() {
                                const sid = this.getAttribute('data-sid');
                                del(sid, userna);
                                setTimeout(() => loadOrderSummary(), 400);
                            });
                        });
                    });
                })
                .catch((error) => {
                    console.error("Error getting documents: ", error);
                });
        }

        function generateBill(customerName, orderId, items) {
            const billContainer = document.getElementById('bill-container');
            const billItemsBody = document.getElementById('bill-items-body');
            const billCustomerName = document.getElementById('bill-customer-name');
            const billOrderId = document.getElementById('bill-order-id');
            const billDate = document.getElementById('bill-date');
            const billSubtotal = document.getElementById('bill-subtotal');
            const billTax = document.getElementById('bill-tax');
            const billTotal = document.getElementById('bill-total');
            
            // Set customer details
            billCustomerName.textContent = customerName;
            billOrderId.textContent = orderId;
            billDate.textContent = new Date().toLocaleDateString();
            
            // Clear previous items
            billItemsBody.innerHTML = '';
            
            // Calculate totals
            let subtotal = 0;
            let slNo = 1;
            
            // Add items to the bill
            items.forEach(item => {
                if (item.name && item.qty && item.price) {
                    const itemTotal = item.price * item.qty;
                    subtotal += itemTotal;
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${slNo}</td>
                        <td>${item.name}</td>
                        <td>${item.qty}</td>
                        <td>₹${item.price.toFixed(2)}</td>
                        <td>₹${itemTotal.toFixed(2)}</td>
                    `;
                    billItemsBody.appendChild(row);
                    slNo++;
                }
            });
            
            // Calculate tax and total
            const tax = subtotal * 0.05;
            const total = subtotal + tax;
            
            // Update totals in the bill
            billSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
            billTax.textContent = `₹${tax.toFixed(2)}`;
            billTotal.textContent = `₹${total.toFixed(2)}`;
            
            // Show the bill
            billContainer.style.display = 'block';
            
            // Hide the summary view
            summaryContainer.style.display = 'none';
            dataContainer.style.display = 'none';
        }
        
        // Function to close the bill view
        window.closeBill = function() {
            document.getElementById('bill-container').style.display = 'none';
            document.getElementById('signout').style.display='block';
            summaryContainer.style.display = 'block';
        };
        
        // Function to print the bill
        window.printBill = function() {
            window.print();
        };

        viewDataBtn.addEventListener('click', () => {
            // Call the function to load order summary
            loadOrderSummary();
        });
        
    } else {
        // No user is signed in
        console.log("No user is signed in.");
    }
});

function createTable(items, userEmail) {
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    table.classList.add('custom-table');
    const f = document.createElement("thead");
    const tr = document.createElement('tr');
    tr.innerHTML = `<th>Name</th>
    <th>Quantity</th>
    <th>Price</th>
    <th>Total</th>
    <th>Status</th>`;
    tbody.appendChild(tr);
    
    items.forEach((item) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name || 'N/A'}</td>
            <td>${item.qty || 'N/A'}</td>
            <td>${item.price || 'N/A'}</td>
            <td>${item.price * item.qty || 'N/A'}</td>
            <td><input type="checkbox" ${item.end ? 'checked' : ''} onclick="updateEndValue('${item.docId}', this.checked, '${userEmail}')"></td>
        `;
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    return table;
}

let signOutButton = document.getElementById("signout")
signOutButton.addEventListener("click", (e) => {
    //Prevent Default Form Submission Behavior
    e.preventDefault()
    console.log("clicked")
    
    auth.signOut()
    alert("Signed Out")
    window.location = "index.html";
})

function updateEndValue(docId, isChecked, usd) {
    db.collection(usd).doc(docId).update({
        end: isChecked
    })
    .then(() => {
        console.log('End value updated successfully!');
    })
    .catch((error) => {
        console.error('Error updating end value:', error);
    });
}

async function del(sid, userna) {
    try {
        // Get a reference to the collection
        const collectionRef = firebase.firestore().collection(userna);
    
        // Get all documents in the collection
        const snapshot = await collectionRef.get();
    
        // Iterate through each document and delete it
        snapshot.forEach(async (doc) => {
            const data = doc.data();
            const sid1 = data.sid;
            if(sid1 === sid){
                await doc.ref.delete();
            }
        });
    
        console.log('All documents deleted successfully');
    } catch (error) {
        console.error('Error deleting documents:', error);
        // Handle the error, e.g., show a message to the user
    }
}