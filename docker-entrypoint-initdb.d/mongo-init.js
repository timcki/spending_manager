print("####################### START ###############################")

db = new Mongo().getDB("spending_manager");
db.createCollection('category', {capped: false});
db.category.insert([
    { "user_id": null, "name": 'zwierzęta', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'jedzenie', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'chemia domowa', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'używki', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'transport i paliwo', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'utrzymanie pojazdu', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'czynsz i wynajem', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'oszczędności i inwestycje', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'podróże i wyjazdy', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'sport i hobby', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'wyjścia i wydarzenia', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'edukacja', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'opieka nad dzieckiem', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'artykuły dziecięce i zabawki', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'elektronika', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'multimedia, "książki"', "icon_colour": 'blue', is_default: true },
    { "user_id": null, "name": 'odzież i obuwie', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'prezenty i wsparcie', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'zdrowie i uroda', "icon_colour": 'blue', "is_default": true },
    { "user_id": null, "name": 'wyposażenie domu', "icon_colour": 'blue', "is_default": true }
]);
print("######################## END ################################")
