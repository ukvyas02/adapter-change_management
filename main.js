// Import built-in Node.js package path.
const path = require('path');

/**
 * Import the ServiceNowConnector class from local Node.js module connector.js
 *   and assign it to constant ServiceNowConnector.
 * When importing local modules, IAP requires an absolute file reference.
 * Built-in module path's join method constructs the absolute filename.
 */
const ServiceNowConnector = require(path.join(__dirname, '/connector.js'));

/**
 * Import built-in Node.js package events' EventEmitter class and
 * assign it to constant EventEmitter. We will create a child class
 * from this class.
 */
const EventEmitter = require('events').EventEmitter;

/**
 * The ServiceNowAdapter class.
 *
 * @summary ServiceNow Change Request Adapter
 * @description This class contains IAP adapter properties and methods that IAP
 *   brokers and products can execute. This class inherits the EventEmitter
 *   class.
 */
class ServiceNowAdapter extends EventEmitter {

    /**
     * Here we document the ServiceNowAdapter class' callback. It must follow IAP's
     *   data-first convention.
     * @callback ServiceNowAdapter~requestCallback
     * @param {(object|string)} responseData - The entire REST API response.
     * @param {error} [errorMessage] - An error thrown by REST API call.
     */

    /**
     * Here we document the adapter properties.
     * @typedef {object} ServiceNowAdapter~adapterProperties - Adapter
     *   instance's properties object.
     * @property {string} url - ServiceNow instance URL.
     * @property {object} auth - ServiceNow instance credentials.
     * @property {string} auth.username - Login username.
     * @property {string} auth.password - Login password.
     * @property {string} serviceNowTable - The change request table name.
     */

    /**
     * @memberof ServiceNowAdapter
     * @constructs
     *
     * @description Instantiates a new instance of the Itential ServiceNow Adapter.
     * @param {string} id - Adapter instance's ID.
     * @param {ServiceNowAdapter~adapterProperties} adapterProperties - Adapter instance's properties object.
     */
    constructor(id, adapterProperties) {
        // Call super or parent class' constructor.
        super();
        // Copy arguments' values to object properties.
        this.id = id;
        this.props = adapterProperties;
        // Instantiate an object from the connector.js module and assign it to an object property.
        this.connector = new ServiceNowConnector({
            url: this.props.url,
            username: this.props.auth.username,
            password: this.props.auth.password,
            serviceNowTable: this.props.serviceNowTable
        });
        log.info('main.connector.url' + this.connector.url);
        log.info('main.connector.username' + this.connector.username);
        log.info('main.connector.password' + this.connector.password);
    }

    /**
     * @memberof ServiceNowAdapter
     * @method connect
     * @summary Connect to ServiceNow
     * @description Complete a single healthcheck and emit ONLINE or OFFLINE.
     *   IAP calls this method after instantiating an object from the class.
     *   There is no need for parameters because all connection details
     *   were passed to the object's constructor and assigned to object property this.props.
     */
    connect() {
        // As a best practice, Itential recommends isolating the health check action
        // in its own method.
        this.healthcheck();
    }

    /**
   * @memberof ServiceNowAdapter
   * @method healthcheck
   * @summary Check ServiceNow Health
   * @description Verifies external system is available and healthy.
   *   Calls method emitOnline if external system is available.
   *
   * @param {ServiceNowAdapter~requestCallback} [callback] - The optional callback
   *   that handles the response.
   */
    healthcheck(callback) {
        let callbackData = null;
        let callbackError = null;

        this.getRecord((result, error) => {
            /**
             * For this lab, complete the if else conditional
             * statements that check if an error exists
             * or the instance was hibernating. You must write
             * the blocks for each branch.
             */

            if (error) {
                callbackError = error;
                /**
                 * Write this block.
                 * If an error was returned, we need to emit OFFLINE.
                 * Log the returned error using IAP's global log object
                 * at an error severity. In the log message, record
                 * this.id so an administrator will know which ServiceNow
                 * adapter instance wrote the log message in case more
                 * than one instance is configured.
                 * If an optional IAP callback function was passed to
                 * healthcheck(), execute it passing the error seen as an argument
                 * for the callback's errorMessage parameter.
                 */
                log.info("before onfline callbackData:" + callbackError);
                this.emitOffline();
                log.info("after callbackData:" + callbackError);
            } else {
                /**
                 * Write this block.
                 * If no runtime problems were detected, emit ONLINE.
                 * Log an appropriate message using IAP's global log object
                 * at a debug severity.
                 * If an optional IAP callback function was passed to
                 * healthcheck(), execute it passing this function's result
                 * parameter as an argument for the callback function's
                 * responseData parameter.
                 */
                callbackData = result;
                log.info("after online callbackData:" + callbackData);
                this.emitOnline();
                log.info("after online callbackData:" + callbackData);
            }
            //return callback(callbackData, callbackError);
        });
    }
    /**
     * @memberof ServiceNowAdapter
     * @method emitOffline
     * @summary Emit OFFLINE
     * @description Emits an OFFLINE event to IAP indicating the external
     *   system is not available.
     */
    emitOffline() {
        this.emitStatus('OFFLINE');
        log.warn('ServiceNow: Instance is unavailable.');
    }

    /**
     * @memberof ServiceNowAdapter
     * @method emitOnline
     * @summary Emit ONLINE
     * @description Emits an ONLINE event to IAP indicating external
     *   system is available.
     */
    emitOnline() {
        this.emitStatus('ONLINE');
        log.info('ServiceNow: Instance is available.');
    }

    /**
     * @memberof ServiceNowAdapter
     * @method emitStatus
     * @summary Emit an Event
     * @description Calls inherited emit method. IAP requires the event
     *   and an object identifying the adapter instance.
     *
     * @param {string} status - The event to emit.
     */
    emitStatus(status) {
        this.emit(status, { id: this.id });
    }

    /**
     * @memberof ServiceNowAdapter
     * @method getRecord
     * @summary Get ServiceNow Record
     * @description Retrieves a record from ServiceNow.
     *
     * @param {ServiceNowAdapter~requestCallback} callback - The callback that
     *   handles the response.
     */
    getRecord(callback) {
        /**
         * Write the body for this function.
         * The function is a wrapper for this.connector's get() method.
         * Note how the object was instantiated in the constructor().
         * get() takes a callback function.
         */
        let callbackData = null;
        let callbackError = null;

        this.connector.get((data, error) => {
            if (error) {
                callbackError = error
            }

            var jsonstring = JSON.stringify(data);
            // jsonObject will contain a valid JavaScript object
            let jsonObject = JSON.parse(jsonstring);//eval('(' + jsonstring + ')');
            let jsonbodystirng = JSON.stringify(jsonObject.body);
            let jsonresultobj = JSON.parse(jsonObject.body);
            //log.info("call data in json13:"+JSON.stringify(jsonresultobj.result[0]));
            log.info("jsonresultobj.result.length array::" + jsonresultobj.result.length + jsonbodystirng);
            let servicejsonObjResult = null;
            for (let i = 0; i < jsonresultobj.result.length; i++) {
                let servicejsonobjarray = JSON.stringify(jsonresultobj.result[i]);
                let jsonresultobjresultarray = JSON.parse(servicejsonobjarray);
                servicejsonObjResult = [{
                    change_ticket_number: jsonresultobjresultarray.number,
                    active: jsonresultobjresultarray.active,
                    priority: jsonresultobjresultarray.priority,
                    description: jsonresultobjresultarray.description,
                    work_start: jsonresultobjresultarray.work_start,
                    work_end: jsonresultobjresultarray.work_end,
                    change_ticket_key: jsonresultobjresultarray.sys_id
                }
                ]
            }
            //callbackData=data;
            //esult);

            return callback(servicejsonObjResult, callbackError);
        });
        // log.info("call data in json1:"+JSON.stringify(calldata));

    }

    /**
     * @memberof ServiceNowAdapter
     * @method postRecord
     * @summary Create ServiceNow Record
     * @description Creates a record in ServiceNow.
     *
     * @param {ServiceNowAdapter~requestCallback} callback - The callback that
     *   handles the response.
     */
    postRecord(callback) {
        /**
         * Write the body for this function.
         * The function is a wrapper for this.connector's post() method.
         * Note how the object was instantiated in the constructor().
         * post() takes a callback function.
         */
        let callbackData = null;
        let callbackError = null;

        this.connector.post((data, error) => {
            let finalVar = null;
            if (error) {
                log.error("This is an error::::::1", error);
                callbackError = error
            } else {

                var jsonstring = JSON.stringify(data);
                let jsonObject = JSON.parse(jsonstring);//eval('(' + jsonstring + ')');
                let jsonbodystirng = JSON.stringify(jsonObject.body);
                let jsonresultobj = JSON.parse(jsonObject.body);
                log.info("jsonresultobj::::::::::", jsonresultobj.result.number);

                finalVar = {
                    change_ticket_number: jsonresultobj.result.number,
                    active: jsonresultobj.result.number,
                    priority: jsonresultobj.result.priority,
                    description: jsonresultobj.result.description,
                    work_start: jsonresultobj.result.work_start,
                    work_end: jsonresultobj.result.work_end,
                    change_ticket_key: jsonresultobj.result.sys_id
                }
                log.info("finalVar:::::::", finalVar);
            }
            return callback(finalVar, callbackError);
        });
    }

}

module.exports = ServiceNowAdapter;