import amqplib from "amqplib";

class Publisher {
  constructor() {}

  public static publish = async (invitees: string[]) => {
    const queue = "fintech.co-invitees";
    const conn = await amqplib.connect(
      "amqps://mzgrooht:kvps8-ZO4o5Ns0ND3NsCONZDJX6hQ5wU@shark.rmq.cloudamqp.com/mzgrooht"
    );
  
    const ch1 = await conn.createChannel();
    await ch1.assertQueue(queue);
  
    // Listener [Client]
    ch1.consume(queue, (msg: any) => {
      if (msg !== null) {
        console.log("Invitees ids recieved : ", JSON.parse(msg.content.toString()));
      //   ch1.ack(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
    });
  
    // Sender
    const ch2 = await conn.createChannel();
  
    ch2.sendToQueue(queue, Buffer.from(JSON.stringify(invitees)));
  };
}

export default Publisher;
