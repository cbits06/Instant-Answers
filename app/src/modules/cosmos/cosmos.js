var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;
module.exports = {
    getData: function (values, proxyURL, language, i18n) {
        const _ = i18n._;
        return new Promise(function (resolve, reject) {
            if (values && values[0]) {
                console.log("TESTING TRAD: "+_("book", "tester_test"));
                const CACHE_KEY = 'ia_cosmos__' + language + "_"+values[2];
                const CACHE_EXPIRE = 7200;
                const redisTools = require('../../redis_tools');
                redisTools.initRedis();
                redisTools.getFromCache(CACHE_KEY).then((cached) => {
                    console.log("BEFORE: "+cached);
                const langue = language.split("_");
                const keywords = "planet mars";

                    if (cached) {
                        cached = JSON.parse(cached);
                        if (cached) {
                            cached.fromCache = true;

                                //MON CODE
                                console.log("CACHE ?");
                            resolve(cached);
                        } else {
                            reject("Error: something went wrong while fetching cached response");
                        }
                    } else {
                        var apiCaller = require('../../api_caller');
                        var cosmic_request = "https://api.le-systeme-solaire.net/rest.php/bodies?data=moons,moon,aroundPlanet,planet,isPlanet,name,englishName,id&filter[]=name,eq,"+values[2]+" "+values[3]+"&filter[]=englishName,eq,"+values[2]+"&filter[]=id,eq,"+values[2]+"&satisfy=any";
                        
                        var cosmic_structure = {
                        "bodies": [{
                          "moons": "Array",
                          "isPlanet": "boolean",
                          "name": "String",
                          "englishName": "String",
                          "id": "String",
                          "@_aroundPlanet": "Object"
                            }]};

                        var wiki_request = "https://api.qwant.com/api/search/ia?safesearch=0&locale=en_gb&q=planet%20mars&t=web&lang=en_gb&internal=true";

                        var wiki_structure = {
                            "status": "String",
                            "data": "object"

                        };

                        

                        var cosmic = apiCaller.call(cosmic_request, cosmic_structure, proxyURL, this.timeout, redisTools);
                        var wiki = apiCaller.call(wiki_request, wiki_structure, proxyURL, this.timeout, redisTools);

                        Promise.all([cosmic, wiki])
                        .then((apiValues) => { 


                            //console.log("API REQ: "+apiValues[1]);
                            apiValues.fromCache = false;

                            if (language == 'fr_fr' || !apiValues[0]["bodies"][0]["englishName"] ) {
                                console.log("??");
                                var element = apiValues[0]["bodies"][0]["name"];
                            } else { console.log("!!"); var element = apiValues[0]["bodies"][0]["englishName"] };

                            
                            if (apiValues[0]["bodies"][0]["isPlanet"] == true) {
                                console.log("THIS IS PLANET "+apiValues[0]["bodies"][0]["name"]);
                                var keywords = _("planet", "cosmos_keywords");
                                console.log(keywords);
                            };

                            if (apiValues[0]["bodies"][0]["isPlanet"] == false && apiValues[0]["bodies"][0]["aroundPlanet"] != null) {
                                console.log("THIS IS A MOON AROUND PLANET "+apiValues[0]["bodies"][0]["aroundPlanet"]["planet"]);
                                var keywords = _("moon", "cosmos_keywords");
                            }

                            if (apiValues[0]["bodies"][0]["isPlanet"] == false && apiValues[0]["bodies"][0]["aroundPlanet"] == null ){
                                console.log(apiValues[0]["bodies"][0]["name"]+" IS A CREEP ");
                                

                                var keywords = _("cosmos", "cosmos_keywords");
                            }

                            console.log("QWANT_API "+wiki_request);

                            //Prepare FULL RESULT
                                var result = {  cosmic: {   name: element

                                                        },
                                                wiki:   {   keywords: keywords

                                                        } 
                                                
                                             };

                            //redisTools.saveToCache(CACHE_KEY, apiValues, CACHE_EXPIRE);
                            resolve     ({      cosmic: { name: result["cosmic"]["name"] },
                                                wiki: {keywords: apiValues[1]}
                                        });
                        

                        

                    }
                    )};
                });
            } else {
                reject("Couldn't process query.")
            }
        });
    },

    /**
     * (OPTIONAL/NEEDED)
     * If your name needs to be translated, use this function getName().
     * @returns the tab name translated
     */

    getName: function (i18n) {
        const _ = i18n._;
        return _("Cosmos", "cosmos");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "Cosmos",

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function (i18n) {
        const _ = i18n._;
        return _("cosmos", "cosmos");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "cosmos",

    /**
     * (OPTIONAL)
     * script : If your IA includes a script, place it under public/javascript/xxx.js and replace "hello" by "xxx".
     */

    

    /**
     * (NEEDED)
     * triggers : Depending on the trigger, the keyword needs to be placed at a specific point in the query.
     * It has 4 different values :
     *          start  : keyword + string
     *          end    : string + keyword
     *          any    : string + keyword + string
     *          strict : perfect match with keyword
     */

    trigger: "start",

    /**
     * (NEEDED)
     * flag : Only 3 flags allowed : (default : i)
     *          - g : global
     *          - m : multi-line
     *          - i : insensitive
     */

    flag: "i",

    /**
     * (NEEDED)
     * timeout : Time before your response is considered as canceled (in milliseconds)
     */

    timeout: 3600,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 10800,

    /**
     * (OPTIONAL)
     * order : Order in the IA hierarchy (0 = first)
     * no order = added at the end, alphabetically
     */

    
};
