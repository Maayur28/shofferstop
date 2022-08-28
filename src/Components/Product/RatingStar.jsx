import React from "react";
import { Progress, Typography } from "antd";
import { StarFilled } from "@ant-design/icons";

const { Text } = Typography;

const RatingStar = ({ ratingData }) => {
  console.log(ratingData);
  return (
    <>
      <div className="pdp_desc_rating_rating_left">
        <div>
          <Text strong style={{ fontSize: "32px" }}>
            {ratingData != null && ratingData.averageRating != null
              ? ratingData.averageRating
              : 0}
          </Text>
          {<StarFilled />}
        </div>
        <div>
          {ratingData != null && ratingData.total != null
            ? ratingData.total
            : 0}
          &nbsp;ratings
        </div>
      </div>
      <div className="pdp_desc_rating_rating_right">
        <div className="pdp_rating_count">
          <Text style={{ fontSize: "14px", textAlign: "left" }}>5</Text>
          {<StarFilled />}
          <Progress
            format={() =>
              ratingData != null && ratingData.ratings != null
                ? ratingData.ratings.fiveStar
                : 0
            }
            strokeColor="#14958f"
            style={{ marginLeft: "10px" }}
            percent={
              ratingData != null &&
              ratingData.ratings != null &&
              ratingData.total != null
                ? (ratingData.ratings.fiveStar / ratingData.total) * 100
                : 0
            }
            size="small"
          />
        </div>
        <div className="pdp_rating_count">
          <Text style={{ fontSize: "14px", textAlign: "left" }}>4</Text>
          {<StarFilled />}
          <Progress
            format={() =>
              ratingData != null && ratingData.ratings != null
                ? ratingData.ratings.fourStar
                : 0
            }
            strokeColor="#14958f"
            style={{ marginLeft: "10px" }}
            percent={
              ratingData != null &&
              ratingData.ratings != null &&
              ratingData.total != null
                ? (ratingData.ratings.fourStar / ratingData.total) * 100
                : 0
            }
            size="small"
          />
        </div>
        <div className="pdp_rating_count">
          <Text style={{ fontSize: "14px", textAlign: "left" }}>3</Text>
          {<StarFilled />}
          <Progress
            format={() =>
              ratingData != null && ratingData.ratings != null
                ? ratingData.ratings.threeStar
                : 0
            }
            strokeColor="#72bfbc"
            style={{ marginLeft: "10px" }}
            percent={
              ratingData != null &&
              ratingData.ratings != null &&
              ratingData.total != null
                ? (ratingData.ratings.threeStar / ratingData.total) * 100
                : 0
            }
            size="small"
          />
        </div>
        <div className="pdp_rating_count">
          <Text style={{ fontSize: "14px", textAlign: "left" }}>2</Text>
          {<StarFilled />}
          <Progress
            format={() =>
              ratingData != null && ratingData.ratings != null
                ? ratingData.ratings.twoStar
                : 0
            }
            strokeColor="#fcb301"
            style={{ marginLeft: "10px" }}
            percent={
              ratingData != null &&
              ratingData.ratings != null &&
              ratingData.total != null
                ? (ratingData.ratings.twoStar / ratingData.total) * 100
                : 0
            }
            size="small"
          />
        </div>
        <div className="pdp_rating_count">
          <Text style={{ fontSize: "14px", textAlign: "left" }}>1</Text>
          {<StarFilled />}
          <Progress
            format={() =>
              ratingData != null && ratingData.ratings != null
                ? ratingData.ratings.oneStar
                : 0
            }
            strokeColor="#f16565"
            style={{ marginLeft: "10px" }}
            percent={
              ratingData != null &&
              ratingData.ratings != null &&
              ratingData.total != null
                ? (ratingData.ratings.oneStar / ratingData.total) * 100
                : 0
            }
            size="small"
          />
        </div>
      </div>
    </>
  );
};

export default RatingStar;
