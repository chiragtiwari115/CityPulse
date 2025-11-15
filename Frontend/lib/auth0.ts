

// export const auth0 = new Auth0({
//   secret: process.env.AUTH0_SECRET!,
//   issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL!,
//   baseURL: process.env.AUTH0_BASE_URL!,
//   clientID: process.env.AUTH0_CLIENT_ID!,
//   clientSecret: process.env.AUTH0_CLIENT_SECRET!,
//   authorizationParams: {
//     scope: 'openid profile email',
//     audience: process.env.AUTH0_AUDIENCE,
//   },
//   routes: {
//     callback: '/api/auth/callback',
//     postLogoutRedirect: '/',
//   },
//   session: {
//     rollingDuration: 60 * 60 * 8, // 8 hours
//     absoluteDuration: 60 * 60 * 24 * 7, // 7 days
//   },
// });

// export default auth0;