import React from "react";

const ResultCard = ({ result }) => {

  let failedText = " Failed Mission";
  if(result.launch_success === false || result.land_success === false){
    failedText = "";
  }

  return (
    <div className="col-12">
      {/* <Card className="mb-3">
        <Card.Img variant="top" src={cat.url} alt={cat.id} />
        <Card.Body>
          <Link className="btn btn-primary btn-block" to={`/details/${cat.id}`}>
            View Details
          </Link>
        </Card.Body>
      </Card> */}

      <div className="row border-bottom">
        <div className="col-12 col-md-2">
          <img className="img-fluid p-3" src={result.links.mission_patch} alt={result.id}/>
        </div>

        <div className="col-12 col-md-8 pt-3 pb-3">
          <h4>{result.rocket.rocket_name} - {result["payloads"][0]["payload_id"]} <span className="text-danger">{failedText}</span></h4>
          <p>Launched {result.launch_date_local} from {result.launch_site.site_name}</p>

          <div className="links">
            {
              result.links.reddit_campaign && (
                <a className="btn btn-outline-secondary" href={result.links.reddit_campaign} rel="noopener noreferrer" target="_blank">
                  Reddit Campaign
                </a>
              )
            }
            {
              result.links.reddit_launch && (
                <a className="btn btn-outline-secondary" href={result.links.reddit_launch} rel="noopener noreferrer" target="_blank">
                  Reddit Launch
                </a>
              )
            }
            {
              result.links.reddit_recovery && (
                <a className="btn btn-outline-secondary" href={result.links.reddit_recovery} rel="noopener noreferrer" target="_blank">
                  Reddit Recovery
                </a>
              )
            }
            {
              result.links.reddit_media && (
                <a className="btn btn-outline-secondary" href={result.links.reddit_media} rel="noopener noreferrer" target="_blank">
                  Reddit Media
                </a>
              )
            }
            {
              result.links.presskit && (
                <a className="btn btn-outline-secondary" href={result.links.presskit} rel="noopener noreferrer" target="_blank">
                  Press
                </a>
              )
            }
            {
              result.links.article_link && (
                <a className="btn btn-outline-secondary" href={result.links.article_link} rel="noopener noreferrer" target="_blank">
                  Article
                </a>
              )
            }
            {
              result.links.video_link && (
                <a className="btn btn-outline-secondary" href={result.links.video_link} rel="noopener noreferrer" target="_blank">
                  Watch Video
                </a>
              )
            }           
          </div>
        </div>

        <div className="col-12 col-md-2 pt-3 pb-3 text-center">
          <h3>#{result.flight_number}</h3>
          <p>Flight Number</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
