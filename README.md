#### ResourceName (`$rn`)
THe primary motivation of the `ResourceName` -- the `.$rn` property -- is to act as analog to `instanceof` or `typeof` paradigms, allowing for system-level metadata management.  As such, a data-level property allows for unambiguous validation in any context (e.g. a class instance, serialized data, Flux-like paradigms, etc.).

While it is **Resource*Name***, it should be thought of as "global type", with the framed understanding that this means "*a unique name for a data model resource that can be used in a data system*".