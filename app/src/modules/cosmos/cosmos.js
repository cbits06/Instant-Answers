var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;

module.exports = {
    

    getData: function (values, proxyURL, language, i18n) {
        const _ = i18n._;
        function formatNumber(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
    };
        return new Promise(function (resolve, reject) {
            if (values && values[0]) {
                const CACHE_KEY = 'ia_cosmos__' + language + "_"+values[2];
                const CACHE_EXPIRE = 7200;
                const redisTools = require('../../redis_tools');
                redisTools.initRedis();
                redisTools.getFromCache(CACHE_KEY).then((cached) => {
                    if (cached) {
                        cached = JSON.parse(cached);
                        if (cached) {
                            cached.fromCache = true;
                            resolve(cached);
                        } else {
                            reject("Error: something went wrong while fetching cached response");
                        }
                    } else {
                        var langue = language.split("_");
                        var tolower = values[0];
                        var req = values[0].replace(/é|è/gi, "e").split(" ");
                        var cosmos_str="";
                        var full_str="";
                        for (var i = 1; i <= req.length-1; i++) {
                            var cosmos_str = cosmos_str + req[i];
                            full_str +=req[i];
                        };
                        var apiCaller = require('../../api_caller');
                        var cosmic_request = "https://api.le-systeme-solaire.net/rest.php/bodies?filter[]=name,eq,"+ cosmos_str +"&filter[]=englishName,eq,"+ cosmos_str +"&filter[]=id,eq,"+ cosmos_str +"&satisfy=any";
                        var cosmic_structure = {
                        "bodies": [{
                          "moons": "Array",
                          "isPlanet": "boolean",
                          "name": "String",
                          "englishName": "String",
                          "id": "String",
                          "semimajorAxis": "number",
                          "inclination": "number",
                          "aphelion": "number",
                          "sideralOrbit": "number",
                          "eccentricity": "number",
                          "mass": "Object",
                          "meanRadius": "number",
                          "vol": "object",
                          "equaRadius": "number",
                          "polarRadius": "number",
                          "density": "number",
                          "gravity": "number",
                          "flattening": "number",
                          "escape": "number",
                          "sideralRotation": "number",
                          "discoveredBy": "string",
                          "discoveryDate": "string",
                          "perihelion": "number",
                          "dimension": "String",
                          "aroundPlanet": "Object",
                          "alternativeName": "String",
                          "rel": "String"
                            }]};
                            var search_str="";
                            var body_type = "";
                            var regexpz = new RegExp( _('planetz', 'cosmos_keywords'), 'gi' );
                            var regextp = new RegExp( _('theplanet', 'cosmos_keywords'), 'gi' );
                            var regexm = new RegExp( _('moon', 'cosmos_keywords'), 'gi' );
                            var regextm = new RegExp( _('themoon', 'cosmos_keywords'), 'gi' );
                            var regexts = new RegExp( _('thesun', 'cosmos_keywords'), 'gi' );
                            var regexte = new RegExp( _('theearth', 'cosmos_keywords'), 'gi' );
                            var regexsm = new RegExp();
                            if (values[0].match(regexpz) == null  && values[0].match(regexm) == null) {
                                var path = require('path');
                                console.log("in THE IF ?: "+search_str);
                                var alienFile = path.join(__dirname, "aliens.json");
                                var aliens = require(alienFile);
                                for (var i = 0; i <= 46; i++) {
                                    if (aliens[i]["id"].includes(full_str) | aliens[i]["name"].includes(full_str) | aliens[i]["englishName"].includes(full_str) ) {
                                        var search_str = aliens[i]["discoveredBy"];
                                        var wiki_request = "https://"+ langue[0] +".wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages&exintro&explaintext&generator=search&gsrsearch="+ search_str +" intitle:"+ full_str+"&gsrlimit=1&redirects=1";
                                    };
                                };
                            };
                        if (values[0].match(regexts) != null) {
                            var wiki_request = "https://"+ langue[0] +".wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages&exintro&explaintext&generator=search&gsrsearch="+ _('thesun', 'cosmos_keywords') +"&gsrlimit=1&redirects=1";
                            var body_type = 'sun';
                        };
                        if (values[0].match(regexte) != null) {
                            var wiki_request = "https://"+ langue[0] +".wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages&exintro&explaintext&generator=search&gsrsearch= intitle:"+ _('theearth', 'cosmos_keywords') +"&gsrlimit=1&redirects=1";
                            var body_type = 'earth';
                        };
                        if (values[0].match(regexm) != null) {

                            var wiki_request = "https://"+ langue[0] +".wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages&exintro&explaintext&generator=search&gsrsearch= intitle:"+ _('moon', 'cosmos_keywords') +" "+ full_str +"&gsrlimit=1&redirects=1";        
                            var body_type = 'themoon';
                        };
                        if (values[0] === _('themoon', 'cosmos_keywords')) {
                            var search_str = _('themoon', 'cosmos_keywords');
                            var wiki_request = "https://"+ langue[0] +".wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages&exintro&explaintext&generator=search&gsrsearch= intitle:"+ search_str +"&gsrlimit=1&redirects=1";    
                        };
                        if (values[0].match(regexpz) != null | values[0].match(regextp) != null) {
                            console.log("Alleluia !!!!");
                            var search_str = _('planet', 'cosmos_keywords');
                        var wiki_request = "https://"+ langue[0] +".wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages&exintro&explaintext&generator=search&gsrsearch= intitle:"+ search_str +" "+ full_str+"&gsrlimit=1&redirects=1";    
                        };
                        var wiki_structure = { "@_batchcomplete": "String",
                                                "@_query": "Object",
                                                "@_continue": "Object",
                                                "@_warnings": "Object",
                                                "@_thumbnail": "object" };
                        var cosmic = apiCaller.call(cosmic_request, cosmic_structure, proxyURL, this.timeout, redisTools);
                        var wiki = apiCaller.call(wiki_request, wiki_structure, proxyURL, this.timeout, redisTools);
                        Promise.all([cosmic, wiki])
                        .then((apiValues) => { 
                            var extrait = null;
                            apiValues.fromCache = false;
                            if (Object.keys(apiValues[0]["bodies"]).length === 0) {
                                reject("Couldn't process query.");
                            };
                            if ( !apiValues[0]["bodies"][0]["englishName"] ) {
                                var element = apiValues[0]["bodies"][0]["name"];
                            } else {var element = apiValues[0]["bodies"][0]["englishName"] };
                            if (apiValues[0]["bodies"][0]["isPlanet"] == true) {
                                var body_type= "planet";
                            };
                            if (apiValues[0]["bodies"][0]["isPlanet"] == false && apiValues[0]["bodies"][0]["aroundPlanet"] != null) {
                                var body_type = "moon";
                            };
                            if (apiValues[0]["bodies"][0]["isPlanet"] == false && apiValues[0]["bodies"][0]["aroundPlanet"] == null ){ 
                                var body_type="other";
                            };
                            console.log(typeof apiValues[1]["query"]);
                            if (typeof apiValues[1]["query"] != "undefined") {
                                console.log("OMG");
                            var object = apiValues[1]["query"]["pages"];
                            var thekey = Object.keys(object);
                            var extrait = apiValues[1]["query"]["pages"][thekey]["extract"].substring(0, 300);
                            var trimmed = extrait.substr(0, Math.min(extrait.length, extrait.lastIndexOf(".")));
                            if (typeof apiValues[1]["query"]["pages"][thekey]["thumbnail"] == "object") {
                                var imgregex= /\/*px-/gi;
                                var image = apiValues[1]["query"]["pages"][thekey]["thumbnail"]["source"].replace("/50px-", "/130px-");
                                } else {var image = null }

                            var wiki_status = "ok";
                            } else {var wiki_status = "niet";};
                            console.log("STATUS: "+wiki_status);
                            if (wiki_status == "ok" && typeof apiValues[1]["query"]["pages"][thekey]["title"] == "string" && apiValues[1]["query"]["pages"][thekey]["title"] != "") {
                                var title = apiValues[1]["query"]["pages"][thekey]["title"];
                            } else {
                                switch (language){
                                    case "fr_fr":
                                        var title= apiValues[0]["bodies"][0]["name"];
                                        break;
                                    case "en_gb":
                                        if (apiValues[0]["bodies"][0]["englishName"] != "") {
                                            var title= apiValues[0]["bodies"][0]["englishName"]
                                        }else { var title= apiValues[0]["bodies"][0]["name"]};
                                        break;
                                    default:
                                        if (apiValues[0]["bodies"][0]["englishName"] != "") {
                                            var title= apiValues[0]["bodies"][0]["englishName"]
                                        }else { var title= apiValues[0]["bodies"][0]["name"]};
                                        break;
                                };
                            };
                            if (apiValues[0]["bodies"][0]["vol"] == null) {
                                var volume=0;
                                var volExponent=0;
                                var volValue=0;
                            }else {
                                var volume= 1;
                                var volValue= apiValues[0]["bodies"][0]["vol"]["volValue"];
                                var volExponent= apiValues[0]["bodies"][0]["vol"]["volExponent"];
                            };
                            if (apiValues[0]["bodies"][0]["mass"] == null) {
                                var mass=0;
                                var massValue=0;
                                var massExponent=0;
                            }else {
                                var mass= 1;
                                var massValue= apiValues[0]["bodies"][0]["mass"]["massValue"];
                                var massExponent= apiValues[0]["bodies"][0]["mass"]["massExponent"];
                            };
                            if (typeof apiValues[0]["bodies"][0]["moons"] == "object" && apiValues[0]["bodies"][0]["moons"] != null) {
                                //moons= apiValues[0]["bodies"][0]["moons"];
                                var moons=[];
                                for (var i = 0 ; i <= apiValues[0]["bodies"][0]["moons"].length - 1; i++) {
                                        moons.push(apiValues[0]["bodies"][0]["moons"][i]["moon"].replace("/", " "));
                                    //var moond = moonz.toString();
                                };
                                var moonsum=moons.length;
                                console.log("MOONZ: "+moonsum);
                            }else {moonz= null};
                            var aphelion= apiValues[0]["bodies"][0]["aphelion"]+" km";
                            var semimajorAxis= apiValues[0]["bodies"][0]["semimajorAxis"]+" km";
                            var inclination= apiValues[0]["bodies"][0]["inclination"]+"°";
                            var sideralOrbit= apiValues[0]["bodies"][0]["sideralOrbit"]+" "+_('d', 'cosmos_fields');
                            var eccentricity= apiValues[0]["bodies"][0]["eccentricity"]+" km";
                            var meanRadius= apiValues[0]["bodies"][0]["meanRadius"];
                            var equaRadius= apiValues[0]["bodies"][0]["equaRadius"];
                            var density= apiValues[0]["bodies"][0]["density"];
                            var polarRadius= apiValues[0]["bodies"][0]["polarRadius"];
                            var gravity= apiValues[0]["bodies"][0]["gravity"];
                            var flattening= apiValues[0]["bodies"][0]["flattening"];
                            var ezcape= apiValues[0]["bodies"][0]["escape"];
                            var sideralRotation= apiValues[0]["bodies"][0]["sideralRotation"];
                            var discoveredBy= apiValues[0]["bodies"][0]["discoveredBy"];
                            var discoveryDate= apiValues[0]["bodies"][0]["discoveryDate"];
                            var aroundPlanet= apiValues[0]["bodies"][0]["aroundPlanet"];

                            var orbital=["semimajorAxis", "aphelion", "eccentricity", "inclination", "sideralOrbit"];
                            var phys=["massValue", "massExponent", "volValue", "volExponent", "density", "gravity", "ezcape", "meanRadius", "equaRadius", "polarRadius", "flattening", "sideralRotation"];
                            var orbitalVal=[];
                            var orbitalFields=[];
                            var orbitalValR=[];
                            var orbitalFieldsR=[];
                            var physVal=[];
                            var physFields=[];
                            var physValR=[];
                            var physFieldsR=[];
                            var nb=0;
                            orbital.forEach(function (key) {
                                nb +=1;
                                if ((apiValues[0]["bodies"][0][key] > 0 | apiValues[0]["bodies"][0][key] != "0" | apiValues[0]["bodies"][0][key] != null ) && nb <=3) {
                                    orbitalVal.push(apiValues[0]["bodies"][0][key]);
                                    orbitalFields.push(key);
                                };
                                if ((apiValues[0]["bodies"][0][key] > 0 | apiValues[0]["bodies"][0][key] != "0" | apiValues[0]["bodies"][0][key] != null) && nb > 3) {
                                    orbitalValR.push(apiValues[0]["bodies"][0][key]);
                                    orbitalFieldsR.push(key);
                                };
                            });
                            var nb=0;
                            phys.forEach(function (key) {
                                nb +=1;
                                if ((apiValues[0]["bodies"][0][key] > 0 | apiValues[0]["bodies"][0][key] != "0" | apiValues[0]["bodies"][0][key] != null ) && nb <=5) {
                                    physVal.push(apiValues[0]["bodies"][0][key]);
                                    physFields.push(key);
                                };
                                if ((apiValues[0]["bodies"][0][key] > 0 | apiValues[0]["bodies"][0][key] != "0" | apiValues[0]["bodies"][0][key] != null) && nb > 5) {
                                    physValR.push(apiValues[0]["bodies"][0][key]);
                                    physFieldsR.push(key);
                                };
                            });    
                            //redisTools.saveToCache(CACHE_KEY, result, CACHE_EXPIRE);
                            resolve     ({      cosmic: {   type: body_type,
                                                            name: element,
                                                            aphelion: formatNumber(aphelion),
                                                            semimajorAxis: formatNumber(semimajorAxis),
                                                            inclination: formatNumber(inclination),
                                                            sideralOrbit: formatNumber(sideralOrbit),
                                                            eccentricity: eccentricity,
                                                            mass: mass,
                                                            massValue: massValue,
                                                            massExponent: massExponent,
                                                            meanRadius: meanRadius,
                                                            volume: volume,
                                                            volValue: volValue,
                                                            volExponent: volExponent,
                                                            equaRadius: equaRadius,
                                                            density: density,
                                                            polarRadius: polarRadius,
                                                            gravity: gravity,
                                                            flattening: flattening,
                                                            ezcape: formatNumber(ezcape),
                                                            sideralRotation: sideralRotation,
                                                            moons: moons,
                                                            discoveredBy: discoveredBy,
                                                            discoveryDate: discoveryDate,
                                                            aroundPlanet: aroundPlanet,
                                                            earth: _('Earth', 'cosmos_bodies'),
                                                            orbitalFields: orbitalFields,
                                                            orbitalVal: orbitalVal,
                                                            orbitalFieldsR: orbitalFieldsR,
                                                            orbitalValR: orbitalValR,
                                                            physVal: physVal,
                                                            physFields: physFields,
                                                            physValR: physValR,
                                                            physFieldsR: physFieldsR,
                                                            moonsum: moonsum
                                                        },
                                                wiki: { wiki_status: wiki_status,
                                                        extract: trimmed,
                                                        img: image,
                                                        title: title,
                                                        langue: langue 
                                                      }
                                        });
                    }
                    )};
                });
            } else {
                reject("Couldn't process query.")
            }
        });
    },
    getName: function (i18n) {
        const _ = i18n._;
    },
    name: "Cosmos",
    getKeyword: function (i18n) {
        const _ = i18n._;
        var qwantsmos = require('./keywords/keywords')(i18n);
            var keywordz = "";
            var planets = "";
            var moons = ""
            var others = "";
            var planet = _("planetz", "cosmos_keywords");
            var themoon = _("themoon", "cosmos_keywords");
            var thesun = _("thesun", "cosmos_keywords");
            var theearth = _("theearth", "cosmos_keywords");
            Object.keys(qwantsmos["keywords"]).forEach(function (key) {
                if (keywordz !== "")
                    keywordz += "|";
                keywordz = keywordz + qwantsmos["keywords"][key];
            });
            Object.keys(qwantsmos["planets"]).forEach(function (key) {
                if (planets !== "")
                    planets += "|";
                planets = planets + qwantsmos["planets"][key];
            });
            Object.keys(qwantsmos["moons"]).forEach(function (key) {
                if (moons !== "")
                    moons += "|";
                moons = moons + qwantsmos["moons"][key];
            });
            Object.keys(qwantsmos["others"]).forEach(function (key) {
                if (others !== "")
                    others += "|";
                others = others + qwantsmos["others"][key];
            });
            console.log(others);
            var meteor = "meteor|asteroid";
            return "("+ theearth +")|("+ thesun +")|("+ themoon +")|((" + planet + ") (" + planets + "))|((" + qwantsmos["keywords"]["moon"] + ") (" + moons + "))|((" + meteor + ") ("+ others +"))"
        },
    trigger: "strict",
    flag: "i",
    timeout: 3600,
    cache: 10800,
};
