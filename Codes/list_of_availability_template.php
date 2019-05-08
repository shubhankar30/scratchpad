
<?php
/**
 * The template name: List Of Availability
 */

get_header(); ?>

<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!--Add Bootstrap to file-->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

</head>
<body>
<div class="container" id="container-no-padding">
  <div class = "table-responsive"><!--To make table responsive accross devices- Bootstrap -->
    <div class = "scrollable-table"><!--Scrollable- Boostrap-->
      <table class="table table-bordered text-center table-striped table-condensed"><!--Bootstrap Table classes-->

      <thead>
      <tr style ="color:white; background:#808080;">
        <!-- COLUMN HEADINGS given here -->
        <?php
        pll_e ("<th class='text-center'> Photos </th>");
        pll_e ("<th class='text-center'> Sharehouse Name </th>");
        pll_e ("<th class='text-center'> No. of People </th>");
        pll_e ("<th class='text-center'> Gender </th>");
        pll_e ("<th class='text-center'> Price (¥) </th>");
        pll_e ("<th class='text-center'> Status </th>");
        pll_e ("<th class='text-center'> Booking Information </th>");
        ?>
      </tr>
    </thead>

<!--
******************Code to display List of Availability***************

This file is used to create a template which is applied to a Page.
This file is added as a theme and stored in themes folder.

Query to select MAX id rows from wp_byt_accommodation_bookings database
The tables wp_byt_accommodation_bookings(wpb), wp_byt_accommodation_vacancies (wpv), wp_posts are joined by joining wp_posts.id column and room_type_id.
The tables wp_byt_postmeta and wp_posts joined at wp_posts.id and wp_postmeta.post_id   .... This join is implemented in order to access Number of People from postmeta.

Refer database structure.

All pll_ functions belong to polylang plugin.Check polylang documentation.
All pll__ and pll_e instances belong to polylang.
-->

<?php
global $wpdb;
$date_of_TBA = (new DateTime())->format('2035-07-30'); //Store the date 2035-07-30 for TBD element
$currdate = (new DateTime())->format('Y-m-d'); //Store today's date in currdate

//Main SQL Query.
$result_name = $wpdb->get_results("SELECT wpv2.price_per_day, GROUP_CONCAT(wpb.date_from) AS date_from, GROUP_CONCAT(wpb.date_to) AS date_to, wp_posts.id as pid, wp_posts.post_title, wp_postmeta.meta_value, wpv2.accommodation_id AS acc_id, wpv2.room_type_id as room_id
  FROM wp_posts
  LEFT JOIN (SELECT wppb.room_type_id, wppb.date_to, wppb.date_from FROM wp_byt_accommodation_bookings AS wppb WHERE wppb.date_to >= DATE '".$currdate."') AS wpb ON wp_posts.id = wpb.room_type_id
  LEFT JOIN wp_postmeta ON wp_posts.id = wp_postmeta.post_id
  INNER JOIN (SELECT wpv1.accommodation_id, wpv1.price_per_day, wpv1.start_date, wpv1.end_date, wpv1.room_type_id FROM wp_byt_accommodation_vacancies AS wpv1 WHERE wpv1.start_date <= DATE '".$currdate."' AND wpv1.end_date >= '".$currdate."') AS wpv2 ON wp_posts.id = wpv2.room_type_id
  WHERE wp_posts.post_status = 'publish'
  AND wp_postmeta.meta_key = 'room_type_max_count'
  GROUP BY wpv2.room_type_id
  ORDER BY wp_posts.post_title ASC
  ");

//print_r($result_name);  To display all the elements in array (Debug)

  echo "<tbody>";
  foreach($result_name as $result){  //traversing array
        $currStatus = 0; //Reset the status to 0 for each iteration
        echo "<tr>";
        echo "<td>".get_the_post_thumbnail( $result->pid, array(150,100) )."</td>"; //inbuilt wordpress function to get thumbnail of post. Post id (pid) passed.
        echo "<td><a href=".get_post_permalink(pll_get_post($result->acc_id)).">".get_the_title(pll_get_post($result->pid))."</a></td>"; //Attach hyperlink to title of post.
        pll_e("<td>Max ");
        echo " ".$result->meta_value; //Display Max number of People
        echo "</td>";

        $project_attrs = wp_get_post_terms(pll_get_post($result->acc_id), 'accommodation_type', array("fields" => "all"));//Retrieve the array having accommodation type of respective post
        echo "<td>".$project_attrs[0]->name."</td>";//Display the first element in array which is the accommodation type.
        echo "<td>".$result->price_per_day."</td>"; //Display price per day

      //To find status of the accommodation, we need booking data for every accommodation and compare it.

      if($result->date_to == NULL || $result->date_from == NULL){ //Nothing is selected from the SQL Query. NO FUTURE OR CURRENT BOOKINGS PRESENT
        pll_e("<td class = 'alert-success'>Available</td>","bookyourtravel");
        pll_e("<td> No Booking </td>","bookyourtravel");
      }
      else{
      $array_of_start_date = explode(",",$result->date_from); // Divide the date_from list and store the dates into array
      $array_of_end_date = explode(",",$result->date_to); // Divide the date_to list and store the dates into array
        foreach($array_of_start_date as $temp){ // Iterate date_from($array_of_start_date) to check if the booking is before or after the currdate($currdate is today's date)
          $start_date = (new DateTime($temp))->format('Y-m-d') ;  //Convert string to DateTime format
          if($start_date <= $currdate){ //UNAVAILABLE: CURRENTLY BOOKED. The start date is before today.
            $currStatus = $currStatus + 1;  // To make $currStatus odd.
          }
          else if($start_date > $currdate){ //AVAILABLE : FUTURE BOOKINGS MADE. The start date is after today.
            $currStatus = $currStatus + 2;  // To make $currStatus even.
          }
            //echo $currStatus."****" //To Debug
        }

        if($currStatus == 1){ //Condition for CURRENTLY NOT AVAILABLE NO FUTURE BOOKINGS.... Because $currStatus + 1 is called only once when the start_date is before current date.
          pll_e("<td class = 'alert-danger'> Not Available </td>","bookyourtravel");
          $temp_end_date = (new DateTime($result->date_to))->format('Y-m-d');//Convert from str to DateTime. Check with date_to as there is only once booking.

            if($temp_end_date == $date_of_TBA){ //Compare with TBA pre declared date.
              echo pll__("<td class = 'text-center'> Available after : TBA </td>","bookyourtravel");
            }
            else{
              echo pll__("<td class = 'text-center'> Available after ","bookyourtravel") .' '. $temp_end_date . pll__("</td>", "bookyourtravel");
            }
        }

      else if($currStatus % 2 == 0){ //Condition for CURRENTLY AVAILABLE BUT FUTURE BOOKINGS MADE
        pll_e("<td class = 'alert-success'> Currently Available </td>","bookyourtravel");
        echo "<td>";
        for($i = 0; $i<sizeof($array_of_start_date);$i++){ //As there are one or more bookings present, Compare with the complete arrays.
          $temp_start_date = (new DateTime($array_of_start_date[$i]))->format('Y-m-d');
          $temp_end_date = (new DateTime($array_of_end_date[$i]))->format('Y-m-d');

            if($temp_end_date == $date_of_TBA){
              echo pll__("<p class = 'smaller-font-size'>Booking from ","bookyourtravel") .' '. $temp_start_date .' '. pll__(" to TBA </p>", "bookyourtravel");
            }
            else{
              echo pll__("<p class = 'smaller-font-size'>Booking from ","bookyourtravel") .' '. $temp_start_date .' '. pll__(" to ", "bookyourtravel") .' '. $temp_end_date . pll__("</p>", "bookyourtravel");
            }
        }
        echo "</td>";
      }

      else if($currStatus > 1 && $currStatus % 2 == 1){//Condition for CURRENTLY NOT AVAILABLE AND FUTURE BOOKINGS MADE
        pll_e("<td class = 'alert-danger'> Not Available </td>", "bookyourtravel");
        echo "<td>";
        for($i=0; $i<sizeof($array_of_start_date);$i++){
          $temp_start_date = (new DateTime($array_of_start_date[$i]))->format('Y-m-d');
          $temp_end_date = (new DateTime($array_of_end_date[$i]))->format('Y-m-d');
          if($temp_end_date == $date_of_TBA){
            echo pll__("<p class = 'smaller-font-size'>Booking from ","bookyourtravel") .' '. $temp_start_date .' '. pll__(" to TBA </p>", "bookyourtravel");
          }
          else{
          echo pll__("<p class = 'smaller-font-size'>Booking from ","bookyourtravel") .' '. $temp_start_date .' '. pll__(" to ", "bookyourtravel") .' '. $temp_end_date . pll__("</p>", "bookyourtravel");
          }
        }
        echo "</td>";
      }
    }
   echo "</tr>";
  }
  echo "</tbody>";
  echo"</table>";
  ?>
      </div>
    </div>
  </div>
</div>
</body>
</html>

<?php get_sidebar(); ?>
<?php get_footer(); ?>
<!--http://jsfiddle.net/drueter/yqgB5/16/-->
