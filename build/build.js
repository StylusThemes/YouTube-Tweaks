/* global require */
"use strict";

const pkg = require( "../package.json" ),

  {
    del,
    createUserCss
  } = require( "./files" );

del( "style.user.css" )
  .then( () => createUserCss( pkg.version ) )
  .then( () => console.log( "\x1b[32m%s\x1b[0m", "YouTube Theater usercss build complete" ) )
  .catch( err => {
    throw err;
  } );
