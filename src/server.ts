import express from 'express';
import { Request, Response } from "express";
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  app.get( "/filteredimage", async ( req: Request, res: Response ) => {

    let image_url: string = req.query.image_url;
    
    if ( !image_url ) {
      res.status(400).send("image_url parameter is required");
    }

    // g modifier: global. All matches (don't return on first match)
    // i modifier: insensitive. Case insensitive match (ignores case of [a-zA-Z])
    var re = /jpg/gi; 
    if ( image_url.toString().search(re) == -1 ) { 
      res.status(415).send("Unsupported Media Type.");
    }

    try {
      const filteredpath = await filterImageFromURL(image_url);
      res.status(200).sendFile(filteredpath, () => {
        deleteLocalFiles([filteredpath]);
      });
    } catch (e) {
        // if Could not find MIME for Buffer check https://knowledge.udacity.com/questions/742363
        res.status(422).send("The server understands the content type of the request entity, and the syntax of the request entity is correct but was unable to process the contained instructions.");
    }

  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}");
  } );

  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();