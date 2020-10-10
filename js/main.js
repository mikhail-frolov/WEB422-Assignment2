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
        <tr style="cursor: pointer" data-id=<%- sale._id %>>
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
<strong>email: </strong><%- sale.customer.email %><br>
<strong>age: </strong><%- sale.customer.age %><br>
<strong>satisfaction: </strong> <%- sale.customer.satisfaction %> / 5
    <br><br>
<h4> Items: $<%- sale.total.toFixed(2) %> </h4>
<table class="table">
<thead>
<tr>
    <th>Product Name</th>
    <th>Quantity</th>
    <th>Price</th>
</tr>
</thead>
<tbody>
<% _.forEach(sale.items, function(sales) { %>
    <tr data-id = <%- sales._id %>>
        <td><%- sales.name %></td>
        <td><%- sales.quantity %></td>
        <td><%- sales.price %></td>
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


function getSaleModelById(id) {

    let retVal = null;
    for (let i = 0; i < saleData.length; i++) {
        if (saleData[i]._id == id) {
            retVal = _.cloneDeep(saleData[i]);
        }

    }
    return retVal;
}

// wiring up click events
$("#sale-table tbody").on("click", "tr", function() {
    // watch the tbody element contained within an element with class "sale-table" and execute code whenever new (or existing) <tr> elements are clicked
    console.log("table row clicked!");

    // id of the clicked row
    let clickedId = $(this).attr("data-id");

    // finding the sale with the same id as the clicked one using Lodash method find()
    let clickedSale = getSaleModelById(clickedId);

    // assigning a new property to our "clickedSale" called "total" and initializing to 0.
    clickedSale.total = 0;

    // FORMULA = total += (price * quantity)
    //Looping through the items and calculating the price using the formula mentioned above.
    for (let index = 0; index < clickedSale.items.length; index++) {
        clickedSale.total += (clickedSale.items[index].price * clickedSale.items[index].quantity);

    }

    $('#sale-modal').modal({ // show the modal programmatically
        backdrop: 'static', // disable clicking on the backdrop to close
        keyboard: false // disable using the keyboard to close in our assignment is "esc"
    });

    // Title Sale: ID in the popup modal of the sale
    $(".modal-title").html(`Sale: ${clickedSale._id}`);

    // clear modal body
    $(".modal-body").empty();

    // Full HTML code to the body of our modal popup
    $(".modal-body").html(saleModelBodyTemplate({ 'sale': clickedSale }));



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
$("#next-page").on("click", function() {

    // increasing page value by 1
    page++;

    // refreshing the "sale-table"
    loadSaleData();
});