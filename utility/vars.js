export const defaultLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };


//   if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
//     Intent intent = new Intent();
//     String packageName = getPackageName();
//     PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
//     if (!pm.isIgnoringBatteryOptimizations(packageName)) {
//         intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
//         intent.setData(Uri.parse("package:" + packageName));
//         startActivity(intent);
//     }
// }



// if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
//     String packageName = reactContext.getPackageName();
//     Intent intent = new Intent();
//     intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
//     intent.setData(Uri.parse("package:" + packageName));
//     intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//     reactContext.startActivity(intent);

// }