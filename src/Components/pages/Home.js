import React, { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import _ from "lodash";
import dayjs from "dayjs";
import ResultCard from "../ResultCard/ResultCard";

const Home = () => {

  const [form, setForm] = useState({
    keywords: '',
    minyear: '',
    maxyear: '',
    pad: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [launches, setLaunches] = useState([]);
  const [pads, setPads] = useState([]);
  const [years, setYears] = useState([]);
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setIsLoading(true);

      //load initial data
      let reqLaunches = fetch(`http://localhost:8001/launches`, {
      });
      let resLaunches = await reqLaunches;
      let finalLaunches = await resLaunches.json();

      let reqPads = fetch(`http://localhost:8001/launchpads`, {
      });
      let resPads = await reqPads;
      let finalPads = await resPads.json();

      let formattedLaunches = finalLaunches.map(launch => {
        //Hacks to make search easier
        launch["launch_year"] = dayjs(launch.launch_date_local).year().toString();
        launch["minyear"] = dayjs(launch.launch_date_local).year().toString();
        launch["maxyear"] = dayjs(launch.launch_date_local).year().toString();
        launch["pad"] = launch.launch_site.site_id;
        return launch;
      })

      //group by year
      let year = _.groupBy(formattedLaunches,"minyear")
      
      //set min/max year select values
      setYears(Object.keys(year))

      //set launch pad values
      setPads(finalPads);

      //set updated launches data
      setLaunches(formattedLaunches);
      
      setIsLoading(false);
    } catch (error) {
      toast.error("Error: " + error.toString());
      setIsLoading(false);
    }
  };

  const selectChange = (e, type) => {
    //save selection to form state
    setForm({
      ...form,
      [type]: e
    })
  };

  const textChange = (e, type) => {
    setForm({
      ...form,
      "keywords": e
    })
  };

  const search_ = (event) => {
    event.preventDefault();

    //show loader
    setIsLoading(true);

    //Remove blank form query attributes
    var query = _.pickBy(form, function(value, key) {
      return !(value === undefined || value === null || value === "");
    });

    if(form.minyear !== "" && form.maxyear !== ""){

      //check if range is valid
      let validRange = _.inRange(parseInt(form.minyear),parseInt(form.maxyear));

      if(validRange === true){
         //mimic db/api range search
        let results_ = launches.filter(launch => {
          if(launch.launch_year >= query.minyear && launch.launch_year <= query.maxyear || (query.pad !== "" && launch.pad === query.pad)){
            return launch;
          }
        })
        
        //set result state
        setResults(results_)
        //set result count 
        setCount(results_.length)

      }else{
        //error message if input range is invalid
        alert("Invalid Range!")
      }

    }else{

      //perform normal search
      let results_ = _.filter(launches, query);

      //set result state
      setResults(results_)
      //set result count 
      setCount(results_.length)

    }

    //hide loader
    setIsLoading(false);
  };

  return (
    <div>
      <div className="hero">
       <h2 className="text-center">Hero Section</h2>
      </div>

      <div className="row">
        <div className="col-12">
          <Form onSubmit={search_}>
            <div className="form-row">
              <Form.Group controlId="keywords" className="col-12 col-md-3">
                <Form.Label>Keywords</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Eg. Falcon"
                  onChange={(e) => {
                    textChange(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="LaunchPad" className="col-12 col-md-2">
                <Form.Label>Launch Pad</Form.Label>
                <Form.Control 
                  as="select"
                  onChange={(e) => {
                    selectChange(e.target.value, 'pad');
                  }}
                >
                  <option value="">Any</option>
                  {pads.map((pad) => (
                    <option key={pad.id} value={pad.id}>
                      {pad.full_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="MinYear" className="col-12 col-md-2">
                <Form.Label>Min Year</Form.Label>
                <Form.Control 
                  as="select"
                  onChange={(e) => {
                    selectChange(e.target.value, 'minyear');
                  }}
                >                
                  <option value="">Any</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="MaxYear" className="col-12 col-md-2">
                <Form.Label>Max Year</Form.Label>
                <Form.Control 
                  as="select"
                  onChange={(e) => {
                    selectChange(e.target.value, 'maxyear');
                  }}
                >                   
                <option value="">Any</option>
                  {years.map((year, index) => (
                    <option key={year+"-"+index} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              
              <Form.Group className="col-12 col-md-2 d-flex align-items-end">
                <Button variant="primary" type="submit">
                  Apply
                </Button>
              </Form.Group>
            </div>
          </Form>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center m-3">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="row mt-4">
          <h5 className="text-center mx-auto">Showing {count} Missions</h5>
          {results.map((result) => (
            <ResultCard key={result.launch_date_local} result={result} />
          ))}
        </div>
      )}

    </div>
  );
};

export default Home;
