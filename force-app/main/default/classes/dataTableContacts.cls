public with sharing class dataTableContacts {


@AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(String filterAppendValue) {
        if(filterAppendValue!=''){
            return [SELECT Id, FirstName, LastName, Title, Phone, Email FROM Contact where FirstName=:filterAppendValue  LIMIT 10];
        }else{
          return [SELECT Id, FirstName, LastName, Title, Phone, Email FROM Contact LIMIT 10];
        
        }
    }
    
}
