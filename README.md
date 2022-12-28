<div  style="text-align: right">
    <img src="./docs/images/enigma-toolkit-logo.png" height="100"/>
</div>

# What's in this toolkit
This toolkit is for anybody who wants to create their own Enigma Machine
simulation. Whether this is a class assignment or a fun side project, this
toolkit should provide the tools necessary to get there.

What you'll find here:

- [documentation](./docs/enigma.md) that gives a brief overview of what the
Enigma is, and some technical details about its operation. Following that is a
detailed breakdown of how to go about writing a simulation and all of the small
details and quirks that will need to be accounted for. And there are many.

- a reference JavaScript implementation of an Enigma simulation and code to
generate test data. There is an [API](./package/README.md) for the simulation
with hooks to observe data as it moves through the system. This is installed as
a node module using npm.

- sample data, both [generated](./test-data/test-messages.json) and
[validated](./test-data/validated-messages.json). The validated messages come in
two forms. The first is real messages that were sent during the war, and the
other is generated messages that have been validated against other simulators.
