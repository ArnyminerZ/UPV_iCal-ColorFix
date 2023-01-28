# UPV_iCal-ColorFix
Fixes the custom properties UPV_BGCOLOR and UPV_FGCOLOR from the UPV's iCal calendars.

[![Continuous Integration][ci-badge]][ci-url]
[![Release][release-badge]][release-url]

[![Latest release][docker-semver-badge]][docker-url]
[![Latest development][docker-date-badge]][docker-url]
[![Latest development][docker-size-badge]][docker-url]

# Why?
The iCal files that the UPV provides is bad formatted, and doesn't follow the rules of the standard, which makes some
clients such as Nextcloud unable to parse them correctly. This application aims to fix this issue.

# How?
Calling the app (e.g. hosted at `localhost`) and passing as the path the url of the given calendar, will make the
request by you, and return you the contents with the `UPV_FGCOLOR` removed, and `UPV_BGCOLOR` replaced by
[`COLOR`](https://icalendar.org/New-Properties-for-iCalendar-RFC-7986/5-9-color-property.html).

Example:
```shell
curl http://localhost/https://www.upv.es/ical/...
```
_Note: https must always be used._

# Deploying
## Docker
Docker is the preferred method for deploying the application. We provide a development
[`docker-compose.yml`](/docker-compose.yml) file. You can run it from the project source with:
```shell
docker-compose up -d
```
You can use the production version, which fetches the image from [Docker Hub][docker-url]. The file is called
[`docker-compose.prod.yml`](/docker-compose.prod.yml). Run it with:
```shell
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

If you want to use the app without cloning the repo, you can use the following docker compose file:
```yaml
# docker-compose.yml
version: '3.7'

services:
  app:
    image: arnyminerz/upv-ical-fix:latest
    container_name: UPV_iCal-ColorFix
    restart: unless-stopped
    ports:
      - "80:80"
```

## NodeJS
It's required to have installed [npm](https://www.npmjs.com/) in the system. Then download the source code with `git`:
```shell
git clone https://github.com/ArnyminerZ/UPV_iCal-ColorFix.git
```
Then access the directory, and install dependencies:
```shell
cd UPV_iCal-ColorFix
npm install
```
Now you can simply run the start script:
```shell
npm start
```


[ci-badge]: https://img.shields.io/github/actions/workflow/status/ArnyminerZ/UPV_iCal-ColorFix/docker-ci.yml?style=for-the-badge
[release-badge]: https://img.shields.io/github/actions/workflow/status/ArnyminerZ/UPV_iCal-ColorFix/docker-release.yml?style=for-the-badge
[docker-date-badge]: https://img.shields.io/docker/v/arnyminerz/upv-ical-fix?style=for-the-badge
[docker-semver-badge]: https://img.shields.io/docker/v/arnyminerz/upv-ical-fix?style=for-the-badge
[docker-size-badge]: https://img.shields.io/docker/image-size/arnyminerz/upv-ical-fix?style=for-the-badge
[ci-url]: https://github.com/ArnyminerZ/UPV_iCal-ColorFix/actions/workflows/docker-ci.yml
[release-url]: https://github.com/ArnyminerZ/UPV_iCal-ColorFix/actions/workflows/docker-release.yml
[docker-url]: https://hub.docker.com/repository/docker/arnyminerz/upv-ical-fix/general
