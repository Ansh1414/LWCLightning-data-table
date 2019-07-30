import { LightningElement,track,wire,api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getContactList from '@salesforce/apex/dataTableContacts.getContactList';
const COLS = [
    { label: 'First Name', fieldName: 'FirstName',sortable: true },
    { label: 'Last Name', fieldName: 'LastName',sortable: true },
    { label: 'Title', fieldName: 'Title' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Email', fieldName: 'Email', type: 'email' }
];

//contactData
export default class LightningDataTable extends LightningElement {
    @track contactData;
    @api hideCheckboxColumn;
    @api sortedBy;
    @api sortedDirection;
    @api keyField;

    @track error;
    @track columns = COLS;
    @track draftValues = [];
    @track filterAppendValue='';
    
    @wire(getContactList, { filterAppendValue:'$filterAppendValue' }) contact({data}){
        if(data){
            window.console.log('data length : '+ data.length);
            
            //storing contact.data in a variable to track changes
            this.contactData=data;
        }}

        /* 
         * refreshApex:refreshes the data table
        */
        sendFiltertoSortDataTable(event){
            this.filterAppendValue=event.target.value;
//            window.console.log(this.filterAppendValue);
            return refreshApex(this.contact);
        }
        //----------------------It will fetch data in table with searched field name from getContactList
        
      /*
      on click of column of lightning data table 'onClickColumnToSort' event will fire which will
      get fieldName(i.e selected field) and sortDirection(which will toggle based upon reverse)
      */
       onClickColumnToSort(event) {
        var fieldName = event.detail.fieldName;
        var sortDirection = event.detail.sortDirection;
        this.sortedBy = fieldName;
        this.sortedDirection = sortDirection;
        this.contactData = this.sortData(fieldName, sortDirection);
    
        this.contactData =JSON.parse(JSON.stringify(this.contactData));
        }
    
       sortData(fieldName, sortDirection) {
        var dataToSort =(this.contactData);
        dataToSort=JSON.parse(JSON.stringify(dataToSort));
        
        let reverse = sortDirection !== 'asc';//toggle previous direction on every click on column
        dataToSort.sort(this.sortBy(fieldName, reverse));
        return dataToSort;
    }
    
    sortBy(field, reverse, primer) {
        var key = primer ?function(x) { return primer(x[field])} : function(x) {return x[field]};
            reverse = !reverse ? 1 : -1;
            window.console.log('key- '+key+' ; field - '+field+' ; reverse - '+reverse);
            return function (a, b) {
                return a = key(a),
                       b = key(b),
                       reverse * ((a > b) - (b > a));
            }
    }   

}