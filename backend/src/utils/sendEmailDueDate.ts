import { Op, Sequelize } from "sequelize";
import { SendMail } from "../helpers/SendMail"
import Company from "../models/Company";
import moment from "moment";

export const sendEmailDueDate = async (): Promise<void> => {

  const companies = await Company.findAll({
    attributes: ['id', 'name', 'dueDate', 'email'],
    where: {
      status: true,
      id: {
        [Op.not]: 1
      },
      [Op.or]: [
        { email: { [Op.not]: null } },
        { email: { [Op.not]: '' } },
        { email: { [Op.not]: "" } }
      ]
    },
    // logging: true
  });

  companies.map(async c => {

    moment.locale('pt-br');
    let dueDate;
    if (c.id === 1) {
      dueDate = '2999-12-31T00:00:00.000Z'
    } else {
      dueDate = c.dueDate;
    }
    const vencimento = moment(dueDate).format("DD/MM/yyyy");

    var diff = moment(dueDate).diff(moment(moment()).format());
    var dias = moment.duration(diff).asDays();

    try {
      if (c.email !== '') {

        if (Math.round(dias) === 3) {

          const _email = {
            to: c.email,
            subject: `Sua mensalidade no 𝘿𝙍𝙈𝙐𝙇𝙏𝙄𝘾𝙃𝘼𝘽𝙊𝙏 vence em 3 dias`,
            text: `<div style="background-color: #f7f7f7; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <p>Prezado(a) cliente,</p>
            <p>Para garantir a continuidade dos serviços prestados pela nossa plataforma, pedimos que realize o pagamento da fatura na tela “Financeiro” na área de “Administração” dentro da plataforma.</p>
            <p>Se precisar de ajuda ou tiver alguma dúvida durante a utilização da plataforma, não hesite em entrar em contato conosco através do nosso WhatsApp no telefone (62) 9860-7134.</p><br>
            <p>Agradecemos por confiar em nosso sistema e esperamos continuar atendendo às suas necessidades em atendimento ao cliente.</p>
            <p>Atenciosamente,<br>Equipe de Suporte</p><br>
            <p><strong>*NÃO RESPONDA ESSA MENSAGEM AUTOMÁTICA, NOSSO NÚMERO DE ATENDIMENTO É O (62) 9860-7134.*</strong></p>
          </div>`
          }

          await SendMail(_email)

        } else if (Math.round(dias) === 2) {

          const _email = {
            to: c.email,
            subject: `Sua mensalidade no 𝘿𝙍𝙈𝙐𝙇𝙏𝙄𝘾𝙃𝘼𝘽𝙊𝙏 vence em 2 dias`,
            text: `<div style="background-color: #f7f7f7; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <p>Prezado(a) cliente,</p>
            <p>Gostaríamos de lembrar que sua mensalidade no 𝘿𝙍𝙈𝙐𝙇𝙏𝙄𝘾𝙃𝘼𝘽𝙊𝙏 está prestes a vencer em 2 dias (${vencimento}). Agradecemos por confiar em nossa plataforma de multiatendimento com chatbot para WhatsApp, e esperamos que ela esteja sendo útil para o seu negócio.</p>
            <p>Para garantir a continuidade dos serviços prestados pela nossa plataforma, pedimos que realize o pagamento da fatura na tela “Financeiro” na área de “Administração” dentro da plataforma.</p>
            <p>Se precisar de ajuda ou tiver alguma dúvida durante a utilização da plataforma, não hesite em entrar em contato conosco através do nosso WhatsApp no telefone (62) 9860-7134.</p><br>
            <p>Agradecemos por escolher o 𝘿𝙍𝙈𝙐𝙇𝙏𝙄𝘾𝙃𝘼𝘽𝙊𝙏 e esperamos continuar atendendo às suas necessidades em atendimento ao cliente.</p>
            <p>Atenciosamente,<br>Equipe de Suporte</p><br>
            <p><strong>*NÃO RESPONDA ESSA MENSAGEM AUTOMÁTICA, NOSSO NÚMERO DE ATENDIMENTO É O (62) 9860-7134.*</strong></p>
          </div>`
          }

          await SendMail(_email)

        } else if (Math.round(dias) === 1) {

          const _email = {
            to: c.email,
            subject: `Importante - Sua mensalidade no 𝘿𝙍𝙈𝙐𝙇𝙏𝙄𝘾𝙃𝘼𝘽𝙊𝙏 venceu hoje`,
            text: `<div style="background-color: #f7f7f7; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <p>Prezado(a) cliente,</p>
            <p>Gostaríamos de lembrar que sua mensalidade no 𝘿𝙍𝙈𝙐𝙇𝙏𝙄𝘾𝙃𝘼𝘽𝙊𝙏 venceu hoje (${vencimento}). Agradecemos por confiar em nossa plataforma de multiatendimento com chatbot para WhatsApp, e esperamos que ela esteja sendo útil para o seu negócio.</p>
            <p>Para continuar a utilizar nossos serviços, pedimos que realize o pagamento na tela “Financeiro” o mais breve possível. Em caso de dúvidas ou para mais informações sobre como realizar o pagamento da fatura, entre em contato conosco através do nosso WhatsApp no telefone (62) 9860-7134.</p><br>
            <p>Atenciosamente,<br>Equipe de Suporte</p><br>
            <p><strong>*NÃO RESPONDA ESSA MENSAGEM AUTOMÁTICA, NOSSO NÚMERO DE ATENDIMENTO É O (62) 9860-7134.*</strong></p>
          </div>`
          }

          await SendMail(_email)

        }

      }

    } catch (error) {
      console.log('Não consegui enviar o email')
    }

  })

}
