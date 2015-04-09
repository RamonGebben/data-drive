/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 */

 // Module requires

var colors = require('colors'); // For pretty logs https://www.npmjs.com/package/colors
var Spreadsheet = require('edit-google-spreadsheet'); // https://github.com/jpillora/node-edit-google-spreadsheet
var _ = require('lodash'); // https://lodash.com/docs
var config = {};

// Helpers/extentions
Array.prototype.contains = function( element ){
    return this.indexOf(element) > -1;
};

// Colors for pretty logging
colors.setTheme({
  silly: 'rainbow',
  feedback: 'grey',
  info: 'cyan',
  data: 'gray',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

// DB array
var db = [];

var sheet;
var metadata = {};

// Connect to the sheet
var connect = function( callback ){
  Spreadsheet.load({
    debug: true,
        spreadsheetName: config.sheet.name,
        spreadsheetId: config.sheet.id,
        worksheetName: config.sheet.worksheet.name,
        worksheetId: config.sheet.worksheet.id,

        username: config.auth.username,
        password: config.auth.password,


        }, function sheetReady( err, spreadsheet ){
           if( !err ){
            _map( spreadsheet, function(){
              if( callback ) callback();
            });
            sheet = spreadsheet;
            spreadsheet.metadata(function(error, md){
              metadata = md
            });
           } else {
          console.log( colors.error( err ) );
           }
  });
}

var _map = function( spreadsheet, callback ) {
  spreadsheet.receive(function(err, rows, info) {
    if(err) throw err;
    db = [];
    for( var key in rows ){
        var s_record = JSON.stringify( rows[ key ] );

        // Mapping the db with map from config file
        for (var i = 0; i < config.mapping.columns.length; i++) {
          s_record = s_record.replace( '"'+ config.mapping.columns[i][0] +'":', '"'+ config.mapping.columns[i][1] +'":');
        };

        s_record = s_record.replace("}", ', "id": '+ key +' }');
        db.push( JSON.parse( s_record ) );
      }

      if( callback ) callback();
  });
}

var _db = function(){
  if( db !== [] ){
    return db;
  }else {
    console.log("DB is empty something went wrong :( ".error )
  }

}

var get = function( arg, callback ){
  var r;
  if ( arg  === parseInt(arg, 10)){
    r = _.where( db, { "id": arg } )[0];
    console.log( "GET".green, colors.info( "ID: " + arg ), colors.data( JSON.stringify( r ) ) );
  }else {
    var q_a = arg.split(' '); // query array
    var l_h = q_a[0]; // lefthand of the query
    var c_o = q_a[1] // comparisen operator
    var r_h = q_a[2]; // righthand of query

    var t_s = {}; // To search for
    t_s[ l_h ] = r_h;
    r = _.where( db, t_s );

    console.log( "GET".green, colors.info( l_h, c_o ,r_h ), colors.data( JSON.stringify( r ) ) );
  }

  if( callback ) callback();

  return r;
}

// Create records
var create = function( data, callback ){
  console.log( "CREATE".info )
  sheet.metadata({
      rowCount: metadata.rowCount + 1,
    }, function(err, md){
      if(err) throw err;
      update( md.rowCount, data, function(){
        if( callback ) callback();
      });
    });
}

// Update records
var update = function( id, data, callback ){
  var obj = {};
  for( var key in data ){
    var s_record = JSON.stringify( data );
    for ( var i = 0; i < config.mapping.columns.length; i++ ) {
      s_record = s_record.replace( '"'+ config.mapping.columns[i][1] +'":', '"'+ config.mapping.columns[i][0] +'":');
    };
    data = JSON.parse( s_record );
  }
  obj[ id ] = data;
  sheet.add( obj );
  console.log( "UPDATE".info, colors.data( JSON.stringify( obj ) ) );

  sheet.send(function( err ) {
      if( err ) throw err;
    });
  if( callback ) callback();
}

var destroy = function( id, callback ){
  console.log( "DESTROY".info )
  var empty = {};
  for (var i = 0; i < config.mapping.columns.length; i++) {
    empty[ config.mapping.columns[i][1] ] = ""
    console.log( empty );
  };
  update( id, empty, function(){
    if( callback ) callback();
  });
}

module.exports = function( cnfg ){
  config = cnfg;
  return {
      db: _db,
      config: cnfg,
      connect: connect,

      get: get,
      create: create,
      update: update,
      destroy: destroy
  }
};
