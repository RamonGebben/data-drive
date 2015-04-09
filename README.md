## Data-Drive

A wrapper to do some easy logging and writing and parsing stuff from and to Google Spreadsheets.


## Install

`npm install data-drive`

Or

Clone the repo to your localhost

`git clone git@github.com:RamonGebben/data-drive.git`


## Quick example

```javascript

var config = require('./config.json');
var DD = require('data-drive')( config );

DD.connect(function(){
	DD.create( { "test": "testing", "test2": "OK" }, function(){
		console.log( "done" );
	} )
});

```

## Configurations

First you must create a doc to write to.
Open your [Drive](https://drive.google.com/drive/#my-drive) and sign in.

Use [this template](https://docs.google.com/spreadsheets/d/1ztKQwLEbpiHC9c8RTH8iInuapXsZKBrLFdGMqjILhwk/edit?usp=sharing) to create a new sheet.

Next we need to configure the `config.json`. The config expects the following values to be present:

```json
"auth": {
	"username": "example@gmail.com",
	"password": "password"
},
"sheet": {
	"name": "name of sheet",
	"id": "optional id",
	"worksheet": {
		"name": "worksheet name",
		"id": "optional id"
	}
}
```

The `sheet.id` and `sheet.worksheet.id` are optional.
These will appear in the console when not given, after that you could add them to make the connection faster.


## Mapping the sheet

Because Google sheets provides us with a json we can't really work with the data gets remapped.
You can ajust the names of the columns in the `config.json`. A mapping would look like this:


```json
"mapping": {
	"columns":[
		["1", "key"],
		["2", "key1"],
		["3", "key2"]
	]
}
```

##### How we receive the data
```json
{
	"1": {
	    "1": "pizza",
	    "2": "koffie",
	    "3": "kebab"
	}
}
```
##### After mapping
```json
{
    "key": "pizza",
    "key1": "koffie",
    "key2": "kebeb",
    "id": 1
}

```

## Actions

The action have a very simple syntax:

```javascript
DD.name_of_action( [id], data, function(){
	//Gets executed when done.
});

```

Although some action may require an id like:

- GET
- UPDATE
- DESTROY

Because else we wouldn't not know which record to update.


#### GET

The `GET` action requires an id or an query to find a array of records to match the query.

```javascript
// With an ID
DD.get( id, function(){
	//Gets executed when done.
});
// => {} returns an Object

// With an query
// NOTE: Only `===` is supported at this point
DD.get( 'key === pizza', data, function(){
	//Gets executed when done.
});
// => [{}, {}, {}] returns an Array of Objects

```

#### CREATE

Adds a new record field to the db and updates it with the data that is given.

```javascript
DD.create( data, function(){
	//Gets executed when done.
});

```
#### UPDATE

Update a record.

```javascript
DD.update( id, data, function(){
	//Gets executed when done.
});

```
#### DESTROY

Removal is not possible. The record field will be made empty so count as inactive.

```javascript
DD.destroy( id, function(){
	//Gets executed when done.
});

```

#### DB

If you want to provide al the info to a client side application you can just dump the entire db.

```javascript

DD.db() // return entire db

```


## Testing

To run the tests, first `cd` into the test dir, edit the `test_config.json` and run:

```bash
npm test
```