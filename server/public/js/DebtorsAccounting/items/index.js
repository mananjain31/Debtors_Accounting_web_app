import DataModel from './DataModel.js';
import CustomAlert from '../utils/CustomAlert.js';

// global variables
let model;
const HTMLS = {
    uomListItem : function(props){
        return $(`<div class="uom-list-item" id=${props.id}>${props.content}</div>`)
    },
}
const CODE_COLUMN_INDEX = 1;
// global variables ends


$(
    ()=>window.dispatchEvent(new Event('resize'))
);

// AJAX functions
const fetchModelAJAX = async () =>{
    const [itemsRes, unitOfMeasurementsRes] = await Promise.all([fetch('/items'), fetch('/unitOfMeasurements')]);
    const [items, unitOfMeasurements] = await Promise.all([itemsRes.json(), unitOfMeasurementsRes.json()]);

    return new DataModel(items, unitOfMeasurements, $('.items-table').dataTable());    
}

const updateSelectedItemAJAX = async(item) => {
    const res = await fetch('/items', {
        method:'PUT',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(item)
    });
    // error here continue from here
    const data = await res.json();
    return data;
}

// AJAX functions ENDS

const addUOMListItem = (unitOfMeasurement, where) =>{
    const uomListItem = HTMLS.uomListItem({
        id : unitOfMeasurement.code,
        content : unitOfMeasurement.name
    });
    if(where === "unadded"){
        $('.unadded-uom').append(uomListItem);
    }
    else {
        $('.added-uom').append(uomListItem);
    }

    uomListItem.click(ev => {
        $(ev.currentTarget).toggleClass('uom-list-item-selected');
    });

}

const removeUOMListItem = (code) =>{

    const uomListItem = $(`.uom-list-item#${code}`);
    uomListItem.remove();
    return {code : code, name : uomListItem.text()?.trim()};
}

const addSelectedUnitOfMeasurements = () => {
    $('.unadded-uom .uom-list-item-selected').each((idx, ele) => {
        addUOMListItem(removeUOMListItem(ele.id), 'added');
    });
}
const removeSelectedUnitOfMeasurements = () => {
    $('.added-uom .uom-list-item-selected').each((idx, ele) => {
        addUOMListItem(removeUOMListItem(ele.id), 'unadded');
    });
}

const getAddedUnitOfMeasuremments = () => {
    const unitOfMeasurements = [];
    $('.added-uom .uom-list-item').each((idx, ele) => {
        console.log(ele.id);
        const uomListItem = $(`.uom-list-item#${ele.id}`);
        unitOfMeasurements.push( {code : ele.id, name : uomListItem.text()?.trim()} );
    });
    return unitOfMeasurements;
}

const uomListSetup = (unitOfMeasurements) => {
    $('.uom-list').empty();
    const uomListItemHeight = parseInt($('.uom-list-item').css('height'));
    const uomListHeight = uomListItemHeight*10;
    $('.uom-list').css('min-height', uomListHeight);


    model.unitOfMeasurements.forEach((unitOfMeasurement)=>{
        if(unitOfMeasurements.find(uom =>{
            return uom.code == unitOfMeasurement.code;
        }) != undefined)
            addUOMListItem(unitOfMeasurement, 'added');
        else
            addUOMListItem(unitOfMeasurement, 'unadded');
    });

}

const itemSelected = (item) => {
    model.setSelectedItem(item);
    $('.selected-item-form #selectedItemCode').val(item.code)
    $('.selected-item-form #selectedItemName').val(item.name)
    $('.selected-item-form #selectedItemCGST').val(item.cgst)
    $('.selected-item-form #selectedItemSGST').val(item.sgst)
    $('.selected-item-form #selectedItemIGST').val(item.igst)
    // console.log(item.unitOfMeasurements);
    uomListSetup(item.unitOfMeasurements);
}

const addItemsTableRow = (item, sno) => {
    model.itemsTable.fnAddData( 
        [
            sno,
            item.code,
            item.name
        ]
    )
    let tr = null;
    const td = $(
        `.items-table > tbody > tr > td:nth-child(${CODE_COLUMN_INDEX + 1})`
    )
    for(const ele of td){
        if(ele.innerText == item.code){
            tr = $(ele.parentNode);
            break;
        }
    }
    
    tr?.click(ev=>{
        const itemObj = model.getItemByCode(item.code);
        itemSelected(itemObj);
    });
}

const populateItemsTable = () =>{
    model.items.forEach((item, sno)=>
        addItemsTableRow(item, sno)
    )
}

const reDrawItemsTable = () =>{
    model.items.forEach((item)=>
        model.itemsTable.fnDeleteRow(0)
    );
    populateItemsTable();
}

const updateSelectedItem = async() => {
    const item = {};
    item.code = $('.selected-item-form #selectedItemCode').val();
    item.name = $('.selected-item-form #selectedItemName').val();
    item.cgst = $('.selected-item-form #selectedItemCGST').val();
    item.sgst = $('.selected-item-form #selectedItemSGST').val();
    item.igst = $('.selected-item-form #selectedItemIGST').val();
    item.unitOfMeasurements = getAddedUnitOfMeasuremments();
    const updatedItem = await updateSelectedItemAJAX(item);
    if(updatedItem.error)
        return CustomAlert.show('An Error Occured', CustomAlert.state.error);
    CustomAlert.show('Item Updated Succesfully', CustomAlert.state.success);
    model.items = model.items.map(item=>item.code == updatedItem.code ? updatedItem : item);
    reDrawItemsTable();
}

const main = async () => {
    model = await fetchModelAJAX();
    populateItemsTable();    
    $('#addUOMButton').click(addSelectedUnitOfMeasurements)
    $('#removeUOMButton').click(removeSelectedUnitOfMeasurements)
    $('#removeUOMButton').click(removeSelectedUnitOfMeasurements)
    $('#updateSelectedItemButton').click(updateSelectedItem)
}

$(
    ()=> {        
        main();
    }
);
