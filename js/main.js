/*********************************************************************************************  
 * WEB422 – Assignment 2
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Mikhail Frolov  Student ID: 164788184    Date: Oct. 9, 2020
 * 
 *
 **********************************************************************************************/


let saleData = []; //array sale data

let page = 1; //default page

const perPage = 10; // 10 sale items per page

// template for each sale 
const saleTableTemplate = _.template(
    `<% _.forEach(saleData, function(sale) { %>
        <tr data-id=<%- sale._id %>>
            <td><%- sale.customer.email %></td>
            <td><%- sale.storeLocation %></td>
            <td><%- sale.items.length %></td>
            <td><%- moment.utc(sale.saleDate).local().format('LLLL') %></td>
            
        </tr>
    <% }); %>`
);

// body template for customer
const saleModelBodyTemplate = _.template(
    `<h4>Customer</h4>
<strong>email:</strong><%- this.customer.email %><br>
<strong>age:</strong><%- this.customer.age %><br>
<strong>satisfaction:</strong> <%- this.customer.satisfaction %> / 5
    <br><br>
<h4> Items: $<%- this.total.toFixed(2) %> </h4>
<table class="table">
<thead>
<tr>
    <th>Product Name</th>
    <th>Quantity</th>
    <th>Price</th>
</tr>
</thead>
<tbody>
<% _.forEach(this.items, function(sale) { %>
    <tr data-id = <%- sale._id %>>
        <td><%- sale.name %></td>
        <td><%- sale.quantity %></td>
        <td><%- sale.price %></td>
    </tr>
 <% }); %>
</tbody>
</table>`);

// fetching data from heroku app
function loadSaleData() {

    fetch(`https://serene-springs-84117.herokuapp.com/api/sales?page=${page}&perPage=${perPage}`)
        .then(response => response.json())
        .then(json => {
            saleData = json;
            let rowData = saleTableTemplate({ sales: saleData });
            $("#sale-table tbody").html(rowData);
            $("#current-page").html(page);
        });
}

// when document is ready execute our loadSaleData function
$(function() {
    // load data to the page
    loadSaleData();
});

// wiring up click events
$(".sale-table tbody").on("click", "tr", function() {
    // watch the tbody element contained within an element with class "sale-table" and execute code whenever new (or existing) <tr> elements are clicked
    console.log("table row clicked!");

    // id of the clicked row
    let clickedId = $(this).attr("data-id");

    // finding the sale with the same id as the clicked one using Lodash method find()
    let clickedSale = saleData.find(({ _id }) => _id == clickedId);

    // assigning a new property to our "clickedSale" called "total" and initializing to 0.
    clickedSale.total = 0;

    // FORMULA = total += (price * quantity)
    //Looping through the items and calculating the price using the formula mentioned above.
    for (let index = 0; index < clickedSale.items.length; index++) {
        clickedSale.total += (clickedSale.items[index].price * clickedSale.items[index].quantity);

    }

    // Title Sale: ID in the popup modal of the sale
    $("#sale-modal h4").html(`Sale: ${clickedSale._id}`);

    // Full HTML code to the body of our modal popup
    $("modal-body").html(saleModelBodyTemplate(clickedSale));

    $('#sale-modal').modal({ // show the modal programmatically
        backdrop: 'static', // disable clicking on the backdrop to close
        keyboard: false // disable using the keyboard to close in our assignment is "esc"
    });

});

// click event for previous-page button
$("#previous-page").on("click", function() {

    // we do not want to let users access page values lower than 1)
    if (page > 1) {
        page--;
    }

    // refreshing the "sale-table"
    loadSaleData();
});

// click event for next-page button
$("#next-page").on("click", function(e) {

    // increasing page value by 1
    page++;

    // refreshing the "sale-table"
    loadSaleData();
});