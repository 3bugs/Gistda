package com.gistda;

import android.app.Application;

//import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.marianhello.bgloc.react.BackgroundGeolocationPackage;
import com.facebook.react.ReactApplication;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import cl.json.RNSharePackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import fr.snapp.imagebase64.RNImgToBase64Package;
import com.RNFetchBlob.RNFetchBlobPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.github.wumke.RNImmediatePhoneCall.RNImmediatePhoneCallPackage;
import com.reactnativecommunity.slider.ReactSliderPackage;
import com.kishanjvaghela.cardview.RNCardViewPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.airbnb.android.react.maps.MapsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNGoogleSigninPackage(),
            new RNSharePackage(),
            //new RNNotificationsPackage(MainApplication.this),
            new BackgroundGeolocationPackage(),
            new SvgPackage(),
            new FBSDKPackage(),
            new RNFusedLocationPackage(),
            new RNImgToBase64Package(),
            new RNFetchBlobPackage(),
            new ImageResizerPackage(),
            new ImagePickerPackage(),
            new RNImmediatePhoneCallPackage(),
            new ReactSliderPackage(),
            new RNCardViewPackage(),
            new LinearGradientPackage(),
            new RNCViewPagerPackage(),
            new VectorIconsPackage(),
            new ReanimatedPackage(),
            new RNGestureHandlerPackage(),
            new MapsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
