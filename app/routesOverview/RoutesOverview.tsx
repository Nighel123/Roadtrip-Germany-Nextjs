import React, { ReactNode } from "react";
import "../../css/global.css";
import "../../css/RoutsOverview.css";
import { Link } from "react-router-dom";

const RoutesOverview: React.FC<{
  children: [ReactNode, ReactNode];
}> = ({ children }) => {
  return (
    <div className="RoutesOverview">
      {/* <!--!gucken wo das gebiet endet auf das man klicken kann vom folgenden hyperlink!--> */}
      <Link to="/home">
        <header></header>
      </Link>
      {/* <!--!gucken wo das gebiet endet auf das man klicken kann vom folgenden hyperlink!--> */}

      {/* <!--list of all Roadtrips--> */}
      <div id="outerFrame">
        <div id="innerFrame">
          <div id="RoadtripsList">{children[0]}</div>
        </div>
      </div>

      {/* <!--little map with routs on it--> */}
      <div id="OuterFrame">
        <div id="InnerFrame">
          <div id="mapSpace">{children[1]}</div>
        </div>
      </div>

      {/* <!--Botton to insert your own roadtrip--> */}
      <Link to="/insertRoadtrip">
        <div id="insertRoadtrip"></div>
      </Link>

      {/* <!--Button for a detailed look on the roadtrip map--> */}
      <Link to="/routsDetailed">
        <div id="routsDetailed"></div>
      </Link>

      {/* <!--Images on the buttom of the page--> */}
      <div id="picture1"></div>
      <div id="picture2"></div>
    </div>
  );
};

export default RoutesOverview;
