import { linearRegression } from "app/ExtendedMath";
import { RoadtripDisplay } from "./definitions";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function mapPlot(
  ref: React.RefObject<HTMLDivElement>,
  zoom: number,
  strokeWeight: number,
  fontSize: string,
  mapClickable: boolean,
  routesClickable: boolean,
  roadtrips: RoadtripDisplay[],
  router: AppRouterInstance
) {
  if (ref.current) {
    const map = new google.maps.Map(ref.current, { gestureHandling: "greedy" });
    map.setOptions(mapOptions);

    const directionsService = new google.maps.DirectionsService();
    let mapBounds = new google.maps.LatLngBounds();
    if (mapClickable) {
      map.addListener("click", function () {
        /* href = "/routsDetailed"; */
      });
    }

    const plotRoute = function (route: google.maps.DirectionsResult | null) {
      let DirectionsRenderer = new google.maps.DirectionsRenderer();

      DirectionsRenderer.setMap(map);
      DirectionsRenderer.setOptions(rendererOptions);
      DirectionsRenderer.setDirections(route);
    };

    const getBoundsOfRoute = function (route: google.maps.DirectionsResult) {
      let Bounds = route.routes[0].bounds;
      let northEast = Bounds.getNorthEast();
      let southWest = Bounds.getSouthWest();
      mapBounds.extend(northEast).extend(southWest);
    };

    const getPolylinePathOfRoute = function (
      route: google.maps.DirectionsResult
    ) {
      let polyLinePath: google.maps.LatLng[] = [],
        steps = route.routes[0].legs[0].steps;
      for (let i = 0; i < steps.length; i++) {
        let segment = steps[i].path;
        for (let j = 0; j < segment.length; j++) {
          polyLinePath.push(segment[j]);
        }
      }
      return polyLinePath;
    };

    const makeDrawnRoutelineClickable = function (
      polylinePath: google.maps.LatLng[],
      roadtrip: RoadtripDisplay
    ) {
      let polyline = new google.maps.Polyline({
        path: polylinePath,
        /*make clickable route invisible*/
        strokeColor: "rgb(200,54,54)",
        strokeOpacity: 0.8,
        strokeWeight: strokeWeight,
        visible: true,
        map: map,
        clickable: false,
        zIndex: 1,
      });

      /*make the displayed routes clickable*/
      if (routesClickable) {
        polyline.setOptions({ clickable: true });
        polyline.addListener(
          "click",
          () => {
            router.push("/viewRoadtrip/" + roadtrip.id);
            /* setSelectedRoadtrip(roadtrip);
            navigate("/viewRoadtrip"); */
          } /* TODO setState and navigate to viewRoadtrip */
        );
      }
    };

    const displayUsernameAboveEachRoute = async function (
      polylinePath: google.maps.LatLng[],
      username: string
    ) {
      class OverlayView extends google.maps.OverlayView {
        polylinePath: google.maps.LatLng[];
        middleIndex: number;
        latLngNamePosition: google.maps.LatLng;
        div: HTMLDivElement | null;
        username: string;
        constructor(
          polylinePath: google.maps.LatLng[],
          map: google.maps.Map,
          username: string
        ) {
          super();
          this.polylinePath = polylinePath;
          this.middleIndex = Math.floor(polylinePath.length / 2);
          this.latLngNamePosition = polylinePath[this.middleIndex];
          this.div = null;
          this.username = username;
          this.setMap(map);
        }

        onAdd() {
          var div = document.createElement("div");

          div.innerHTML = this.username;

          div.style.borderStyle = "none";
          div.style.borderWidth = "0px";
          div.style.position = "absolute";
          div.style.fontSize = fontSize;
          div.style.fontWeight = "700";
          div.style.opacity = "0.8";

          let panes = this.getPanes();

          panes?.overlayMouseTarget.appendChild(div);
          this.div = div;
        }

        draw() {
          let projection = this.getProjection(),
            pxNamePosition = projection.fromLatLngToDivPixel(
              this.latLngNamePosition
            ),
            div = this.div;
          if (pxNamePosition && div) {
            let pxPointsNearNameArray = this.getPointsInPxRadiusOfName(
                40,
                pxNamePosition,
                projection
              ),
              radiansToRotate = this.getRotateRadians(pxPointsNearNameArray);

            div.style.left =
              pxNamePosition.x - 31.5 + Math.sin(radiansToRotate) * 15 + "px";
            div.style.top =
              pxNamePosition.y - 13.5 - Math.cos(radiansToRotate) * 15 + "px";

            div.style.transformOrigin = "50% 50%";

            div.style.transform = "rotate(" + radiansToRotate + "rad)";
          }
        }

        onRemove() {
          this.div?.parentNode?.removeChild(this.div);
        }

        getPointsInPxRadiusOfName(
          radius: number,
          pxNamePosition: google.maps.Point,
          projection: google.maps.MapCanvasProjection
        ) {
          let path = polylinePath,
            linearRegressionArray: google.maps.Point[] = [];

          for (var i = this.middleIndex - 50; i < this.middleIndex + 50; i++) {
            if (path[i]) {
              var pointPosition = projection.fromLatLngToDivPixel(path[i]);
              if (pointPosition) {
                let transformedPoint = new google.maps.Point(
                  pointPosition.x - pxNamePosition.x,
                  pointPosition.y - pxNamePosition.y
                );
                if (
                  Math.pow(transformedPoint.x, 2) +
                    Math.pow(transformedPoint.y, 2) <
                    Math.pow(radius, 2) ||
                  i === this.middleIndex + 1 ||
                  i === this.middleIndex - 1
                ) {
                  linearRegressionArray.push(transformedPoint);
                }
              }
            }
          }

          return linearRegressionArray;
        }

        getRotateRadians(PointsArray: google.maps.Point[]): number {
          let slope = linearRegression(PointsArray).slope,
            radians = Math.atan(slope);
          return radians;
        }
      }

      new OverlayView(polylinePath, map, username);
    };

    Promise.all(
      roadtrips.map((roadtrip) => {
        return directionsService
          .route({
            origin: roadtrip.starttown,
            destination: roadtrip.desttown,
            travelMode: google.maps.TravelMode.DRIVING,
          })
          .then((route) => {
            plotRoute(route);
            getBoundsOfRoute(route);
            return route;
          })
          .catch((error) => {
            throw error;
          });
      })
    ).then((routs) => {
      map.fitBounds(mapBounds);
      map.setZoom(zoom);

      routs.map((route, i) => {
        let polylinePathHR = getPolylinePathOfRoute(route);
        makeDrawnRoutelineClickable(polylinePathHR, roadtrips[i]);
        let polylinePathLR = route.routes[0].overview_path;
        displayUsernameAboveEachRoute(polylinePathLR, roadtrips[i].username);
      });
    });
  }
}

let rendererOptions = {
  preserveViewport: true,
  supressPolylines: true,
};

/*Object to specify the settings for the map*/
const mapOptions: google.maps.MapOptions = {
  mapTypeControl: false,
  zoomControl: false,
  streetViewControl: false,
  minZoom: 2,

  /*specify styles for the map e.g. not to show little village names*/
  styles: [
    {
      featureType: "administrative.neighborhood",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ],

  /*end setting-object*/
};
