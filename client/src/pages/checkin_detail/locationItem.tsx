import { Text, View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import getLocation from "../../utils/getLocation";
import { MapMarked } from "@taroify/icons";

const LocationItem = ({ content }) => {
  const [location, setLocation] = useState<any>();

  useEffect(() => {
    (async () => {
      const result = await getLocation({
        latitude: content.latitude,
        longitude: content.longitude
      });
      setLocation(result);
    })();
  }, []);

  return (
    <View>
      <MapMarked style={{ color: "#1989fa", marginRight: "16rpx" }} />
      {!location ? "加载中..." : location?.formatted_address}
    </View>
  );
};

export default LocationItem;
