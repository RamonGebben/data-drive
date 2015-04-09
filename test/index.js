
var should = require('chai').should();
var config = require('./test_config.json');
var GQL = require('../index')( config );

describe('Connection', function(){
  describe('#connect()', function(){
    it('should connect without error', function( done ){
    	GQL.connect();
    	setTimeout(done, 1000)
    });
  });


})

describe('CRUDs', function(){
  describe('#create()', function(){
    it('should get without error', function( done ){
    	GQL.connect( function(){
    		setTimeout(GQL.create( { "test": "testing", "test2": "OK" } ), 500 )
    	});
    	setTimeout(done, 1000)
    });
  });	
  describe('#get()', function(){
    it('should get without error', function( done ){
    	GQL.connect( GQL.get( "test2 === OK" ) )
    	setTimeout(done, 1000)
    });
  });

})
