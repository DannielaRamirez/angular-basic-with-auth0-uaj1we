import { Injectable } from "@angular/core";
import * as auth0 from "auth0-js";
import { AUTH_CONFIG } from './../../environments/environment';
import { Router } from "@angular/router";

(window as any).global = window;

@Injectable()
export class AuthService {
  auth0 = new auth0.WebAuth({
    // the following three lines MUST be updated
    domain: AUTH_CONFIG.domain, // TODO '<YOUR_AUTH0_DOMAIN>'
    audience: AUTH_CONFIG.audience, // TODO: https://<YOUR_AUTH0_DOMAIN>/userinfo
    clientID: AUTH_CONFIG.clientID, // TODO: '<YOUR_AUTH0_CLIENT_ID>'
    redirectUri: AUTH_CONFIG.redirectUri,
    responseType: "token",
    scope: "openid profile"
  });
// Store authentication data
  expiresAt: number;
  userProfile: any;
  accessToken: string;
  authenticated: boolean;

  constructor(private router: Router) {
    this.getAccessToken();
  }

  login() {
    // Auth0 authorize request
    this.auth0.authorize();
  }

  handleLoginCallback() {
    // When Auth0 hash parsed, get profile
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        this.getUserInfo(authResult);
      } else if (err) {
        console.error(`Error: ${err.error}`);
      }
      this.router.navigate(['/']);
    });
  }

  getAccessToken() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken) {
        this.getUserInfo(authResult);
      }
    });
  }

  getUserInfo(authResult) {
    // Use access token to retrieve user's profile and set session
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      if (profile) {
        this._setSession(authResult, profile);
      }
    });
  }

  private _setSession(authResult, profile) {
    // Save authentication data and update login status subject
    this.expiresAt = authResult.expiresIn * 1000 + Date.now();
    this.accessToken = authResult.accessToken;
    this.userProfile = profile;
    this.authenticated = true;
  }

  logout() {
    // Log out of Auth0 session
    // Ensure that returnTo URL is specified in Auth0
    // Application settings for Allowed Logout URLs
    this.auth0.logout({
      returnTo: 'https://angular-basic-with-auth0.stackblitz.io',
      clientID: AUTH_CONFIG.clientID
    });
  }

  get isLoggedIn(): boolean {
    // Check if current date is before token
    // expiration and user is signed in locally
    return (Date.now() < this.expiresAt) && this.authenticated;
  }
}
