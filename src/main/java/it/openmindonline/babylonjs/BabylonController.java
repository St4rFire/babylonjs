package it.openmindonline.babylonjs;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@Controller
public class BabylonController
{

    @RequestMapping("/babylon")
    public String greeting(@RequestParam(value="name", required=false, defaultValue="World") String name, Model model) {
        model.addAttribute("name", name);
        return "babylon";
    }

    @RequestMapping(value = "/downloadtexture")
    public void downloadOrder(@RequestParam(value="name") String name, HttpServletResponse response)
    {

        try (InputStream in = getClass().getResourceAsStream("/static/babylon/mesh/spaceship/0.png")) // todo use convention
        {
            response.setHeader("Content-Disposition", "attachment; filename=" + name + ".png");
            response.setContentType("application/xml");
            //response.setContentLength(in.length);
            ServletOutputStream outputStream = response.getOutputStream();
            IOUtils.copy(in, outputStream);
            IOUtils.closeQuietly(outputStream);
            IOUtils.closeQuietly(in);
        }
        catch (Exception e)
        {
            //log.error("Error exporting order {}", orderNumber, e);
        }
    }




}
